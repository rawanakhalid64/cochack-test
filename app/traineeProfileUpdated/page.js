'use client'
import React, { useState, useEffect } from "react";
import instance from "../../utils/axios";
import { useRouter } from "next/navigation";
import SidebarLayout from "../../components/SidebarLayout/SidebarLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../Redux/userSlice";
import ProfileImageUploader from "../../components/ProfileImageUploader/ProfileImageUploader";
// import ImageDisplay from "../../components/ImageDisplay/ImageDisplay";

export default function TraineeProfileUpdated() {
  const dispatch = useDispatch();
  const userDataState = useSelector(state => state.user.userData);
  const isLoading = useSelector(state => state.user.isLoading);
  const router = useRouter();
  
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    weight: "",
    height: "",
    fitnessLevel: "",
    goal: "",
    profilePhoto: "",
    job: "",
    healthCondition: [],
    allergy: []
  });
  const [displayedImage, setDisplayedImage] = useState(""); // State for displayed image
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [isChangingPhoto, setIsChangingPhoto] = useState(false);
  
  const [healthConditionNames, setHealthConditionNames] = useState([]);
  const [allergyNames, setAllergyNames] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check for uploaded image URL in localStorage
    const uploadedProfileImage = localStorage.getItem('uploadedProfileImage');
    
    if (uploadedProfileImage) {
      setDisplayedImage(uploadedProfileImage);
    }
    
    if (!userDataState) {
      dispatch(fetchUserData());
    } else {
      setUserData({
        firstName: userDataState.firstName || "N/A",
        lastName: userDataState.lastName || "N/A",
        email: userDataState.email || "N/A",
        birthdate: userDataState.dateOfBirth || "N/A",
        profilePhoto: userDataState.profilePhoto,
        weight: userDataState.weight ? `${userDataState.weight} kg` : "Not provided",
        height: userDataState.height ? `${userDataState.height} cm` : "Not provided",
        fitnessLevel: userDataState.fitnessLevel || "Not specified",
        goal: userDataState.fitnessGoal || "No goal set",
        job: userDataState.job || "Not specified",
        healthCondition: userDataState.healthCondition || [],
        allergy: userDataState.allergy || []
      });
      
      // Only set displayedImage from userData if no uploaded image was found
      if (!uploadedProfileImage && userDataState.profilePhoto) {
        setDisplayedImage(userDataState.profilePhoto);
      }
      
      if (userDataState.healthCondition && userDataState.healthCondition.length > 0) {
        fetchHealthConditionNames(userDataState.healthCondition);
      }
      
      if (userDataState.allergy && userDataState.allergy.length > 0) {
        fetchAllergyNames(userDataState.allergy);
      }
    }
  }, [userDataState, dispatch]);

  const fetchHealthConditionNames = async (healthConditionIds) => {
    try {
      const response = await instance.get(`/api/v1/health-conditions`);
      const healthConditionsArray = response.data.healthConditions || [];
      const healthConditions = healthConditionsArray.filter(condition => 
        healthConditionIds.includes(condition._id || condition.id)
      );
      const names = healthConditions.map(condition => condition.name || "Unknown condition");
      setHealthConditionNames(names);
    } catch (error) {
      console.error("Error fetching health condition names:", error);
      setHealthConditionNames(healthConditionIds.map(() => "Unknown condition"));
    }
  };

  const fetchAllergyNames = async (allergyIds) => {
    try {
      const response = await instance.get(`/api/v1/allergies`);
      const allergiesArray = response.data.allergies || [];
      const allergies = allergiesArray.filter(allergy => 
        allergyIds.includes(allergy._id || allergy.id)
      );
      const names = allergies.map(allergy => allergy.name || "Unknown allergy");
      setAllergyNames(names);
    } catch (error) {
      console.error("Error fetching allergy names:", error);
      setAllergyNames(allergyIds.map(() => "Unknown allergy"));
    }
  };

  const handleEditClick = (section) => {
    setActiveSection(section);
    setIsEditing(true);
  };

  const handleChangePhotoClick = () => {
    setIsChangingPhoto(true);
  };

  const handleImageChange = (newImageUrl) => {
    setDisplayedImage(newImageUrl);
    setUserData(prev => ({ ...prev, profilePhoto: newImageUrl }));
    // Store in localStorage for persistence
    localStorage.setItem('uploadedProfileImage', newImageUrl);
    setIsChangingPhoto(false);
  };

  const handleCancelPhotoChange = () => {
    setIsChangingPhoto(false);
  };

  const handleSave = async () => {
    try {
      const preparedData = {
        ...userData,
        weight: userData.weight ? parseInt(userData.weight.replace(" kg", "")) : null,
        height: userData.height ? parseInt(userData.height.replace(" cm", "")) : null,
        birthdate: userData.birthdate
          ? new Date(userData.birthdate).toISOString()
          : null,
        // Add the displayed image URL to the saved profile data
        profilePhoto: displayedImage
      };
  
      const response = await instance.patch("/api/v1/users/me", preparedData);
  
      if (response.data && response.data.user) {
        setUserData({
          ...response.data.user,
          weight: response.data.user.weight
            ? `${response.data.user.weight} kg`
            : "Not provided",
          height: response.data.user.height
            ? `${response.data.user.height} cm`
            : "Not provided",
          birthdate: response.data.user.birthdate || "",
        });
        setIsEditing(false);
        dispatch(fetchUserData());
        
        // Clear the localStorage after saving
        localStorage.removeItem('uploadedProfileImage');
      } else {
        throw new Error("Error saving user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Guard for server-side rendering
  if (typeof window === 'undefined') {
    return <SidebarLayout><div>Loading...</div></SidebarLayout>;
  }

  if (isLoading || !isMounted) return <SidebarLayout><div>Loading...</div></SidebarLayout>;

  const getAge = (birthdate) => {
    if (!birthdate) return "";
    const dob = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const formatBirthdate = (birthdate) => {
    if (!birthdate) return "";
    const date = new Date(birthdate);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  };

  const navigateToProfileView = () => {
    router.push('/traineeProfileView');
  };

  return (
    <SidebarLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <button 
            onClick={navigateToProfileView}
            className="ml-4 flex items-center bg-red-400 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            View Profile
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-200 rounded-md px-10 py-2 w-64"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-2.5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mr-6 mb-4 md:mb-0 relative">
            {isChangingPhoto ? (
              <div className="flex flex-col items-center">
                <ProfileImageUploader 
                  currentImage={displayedImage} 
                  onImageChange={handleImageChange}
                  size="md"
                  editable={true}
                  useLocalStorage={true} 
                />
                <button
                  onClick={handleCancelPhotoChange}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                  {displayedImage ? (
                    <img 
                      src={displayedImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleChangePhotoClick}
                  className="mt-2 w-full text-center bg-red-400 hover:bg-red-500 text-white text-sm py-1 px-2 rounded transition-colors duration-200"
                >
                  Change Photo
                </button>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{userData.firstName} {userData.lastName}</h2>
            <p className="text-gray-600">{getAge(userData.birthdate)} years old</p>
            <p className="text-gray-600">{userData.job}</p>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Personal Information</h3>
          {!isEditing || activeSection !== "personal" ? (
            <button
              onClick={() => handleEditClick("personal")}
              className="p-2 bg-red-100 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              disabled={!isEditing || activeSection !== "personal"}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              disabled={!isEditing || activeSection !== "personal"}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              disabled
              className="w-full p-2 border bg-gray-50 rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Birthday</label>
            <input
              type="date"
              name="birthdate"
              value={
                userData.birthdate
                  ? new Date(userData.birthdate).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              disabled={!isEditing || activeSection !== "personal"}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Job</label>
            <input
              type="text"
              name="job"
              value={userData.job}
              onChange={handleChange}
              disabled={!isEditing || activeSection !== "personal"}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Fitness Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Fitness Information</h3>
          {!isEditing || activeSection !== "fitness" ? (
            <button
              onClick={() => handleEditClick("fitness")}
              className="p-2 bg-red-100 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block font-medium mb-1">Weight</label>
            <input
              type="text"
              name="weight"
              value={userData.weight}
              onChange={handleChange}
              disabled={!isEditing || activeSection !== "fitness"}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Height</label>
            <input
              type="text"
              name="height"
              value={userData.height}
              onChange={handleChange}
              disabled={!isEditing || activeSection !== "fitness"}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Fitness Level</label>
            <input
              type="text"
              name="fitnessLevel"
              value={userData.fitnessLevel}
              onChange={handleChange}
              disabled={!isEditing || activeSection !== "fitness"}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Goal</label>
            <input
              type="text"
              name="goal"
              value={userData.goal}
              onChange={handleChange}
              disabled={!isEditing || activeSection !== "fitness"}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Health Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Health Information</h3>
          {!isEditing || activeSection !== "health" ? (
            <button
              onClick={() => handleEditClick("health")}
              className="p-2 bg-red-100 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Health Conditions</label>
            <div className="border rounded-md p-2 min-h-10">
              {healthConditionNames && healthConditionNames.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {healthConditionNames.map((condition, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {condition}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">No health conditions specified</span>
              )}
            </div>
            {isEditing && activeSection === "health" && (
              <div className="mt-2">
                <button className="text-sm text-blue-600 hover:underline">
                  + Add health condition
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Allergies</label>
            <div className="border rounded-md p-2 min-h-10">
              {allergyNames && allergyNames.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allergyNames.map((allergy, index) => (
                    <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">No allergies specified</span>
              )}
            </div>
            {isEditing && activeSection === "health" && (
              <div className="mt-2">
                <button className="text-sm text-blue-600 hover:underline">
                  + Add allergy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 transition-colors"
          >
            Save
          </button>
        </div>
      )}
    </SidebarLayout>
  );
}