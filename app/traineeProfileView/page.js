"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SidebarLayout from "../../components/SidebarLayout/SidebarLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../Redux/userSlice";
// import Image from "next/image";

export default function TraineeProfileView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userDataState = useSelector(state => state.user.userData);
  const isLoading = useSelector(state => state.user.isLoading);
  
  // State to handle client-side rendering of profile image
  const [imageLoaded, setImageLoaded] = useState(false);
  // State to store the profile image URL
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  // Fetch user data from Redux if not available
  useEffect(() => {
    if (!userDataState) {
      dispatch(fetchUserData());
    }
  }, [userDataState, dispatch]);

  // Check for profile image in localStorage and set it
  useEffect(() => {
    // Set imageLoaded to true after hydration is complete
    setImageLoaded(true);
    
    // Check localStorage for uploaded profile image
    const storedImage = typeof window !== 'undefined' ? localStorage.getItem('uploadedProfileImage') : null;
    
    // If there's an image in localStorage, use that
    if (storedImage) {
      setProfileImageUrl(storedImage);
    } 
    // Otherwise use the one from Redux state if available
    else if (userDataState?.profilePhoto) {
      setProfileImageUrl(userDataState.profilePhoto);
    }
  }, [userDataState]);

  const handleEditProfile = () => {
    router.push('/traineeProfileUpdated');
  };

  if (isLoading) return <SidebarLayout><div>Loading...</div></SidebarLayout>;

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
    if (!birthdate) return "Not provided";
    const date = new Date(birthdate);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  };

  // Calculate BMI if weight and height are available
  const calculateBMI = () => {
    if (!userDataState?.weight || !userDataState?.height) return null;
    
    // Convert height from cm to meters
    const heightInMeters = userDataState.height / 100;
    // Calculate BMI
    const bmi = (userDataState.weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    // Determine BMI category
    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi >= 18.5 && bmi < 25) category = "Normal weight";
    else if (bmi >= 25 && bmi < 30) category = "Overweight";
    else category = "Obesity";
    
    return { value: bmi, category };
  };

  const bmi = calculateBMI();

  // Simple Profile Image Component to avoid hydration errors
  const ProfileImage = ({ src }) => {
    // Only render the actual image after client-side hydration
    if (!imageLoaded) {
      return (
        <div className="w-full h-full bg-gray-200 rounded-lg"></div>
      );
    }
    
    // Use the profile image URL from state (which could be from localStorage or Redux)
    const imageUrl = src || profileImageUrl || "https://via.placeholder.com/150";
    
    return (
      <img
        src={imageUrl}
        alt="Profile"
        className="w-full h-full object-cover rounded-lg"
      />
    );
  };

  // Profile content
  const profileContent = (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Profile Overview</h1>
        <button 
          onClick={handleEditProfile}
          className="flex items-center bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-red-400 to-red-300 h-32"></div>
        <div className="px-8 pt-0 pb-8 relative">
          <div className="flex flex-col md:flex-row">
            <div className="relative -mt-16 md:mr-6">
              <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-lg">
                <ProfileImage />
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {imageLoaded ? (userDataState?.firstName || "N/A") : "N/A"} {imageLoaded ? (userDataState?.lastName || "") : ""}
              </h2>
              <div className="text-gray-600 mb-4">
                <p>{getAge(userDataState?.dateOfBirth)} years old • {userDataState?.job || "Not specified"}</p>
                <p>Member since {new Date().getFullYear()}</p>
              </div>
              <div className="flex flex-wrap gap-3 mb-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {userDataState?.fitnessLevel || "Fitness level not set"}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Goal: {userDataState?.fitnessGoal || "No goal set"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Body Metrics */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Body Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Height</span>
              <span className="font-medium">{userDataState?.height ? `${userDataState.height} cm` : "Not provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight</span>
              <span className="font-medium">{userDataState?.weight ? `${userDataState.weight} kg` : "Not provided"}</span>
            </div>
            {bmi && (
              <div className="flex justify-between">
                <span className="text-gray-600">BMI</span>
                <span className="font-medium">{bmi.value} ({bmi.category})</span>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-right">{userDataState?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Birthdate</span>
              <span className="font-medium">{formatBirthdate(userDataState?.dateOfBirth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Occupation</span>
              <span className="font-medium">{userDataState?.job || "Not specified"}</span>
            </div>
          </div>
        </div>

        {/* Fitness Stats */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Fitness Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Workouts Completed</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Duration</span>
              <span className="font-medium">28 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Workout Time</span>
              <span className="font-medium">45 minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Information */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Health Conditions</h4>
            {userDataState?.healthCondition && userDataState.healthCondition.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userDataState.healthCondition.map((condition, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {typeof condition === 'object' ? condition.name : condition}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No health conditions specified</p>
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Allergies</h4>
            {userDataState?.allergy && userDataState.allergy.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userDataState.allergy.map((allergy, index) => (
                  <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    {typeof allergy === 'object' ? allergy.name : allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No allergies specified</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start p-3 border-l-4 border-green-400 bg-green-50 rounded-r-lg">
            <div className="flex-shrink-0 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Completed Upper Body Workout</p>
              <p className="text-sm text-gray-600">Yesterday at 7:30 PM • 45 minutes</p>
            </div>
          </div>
          <div className="flex items-start p-3 border-l-4 border-blue-400 bg-blue-50 rounded-r-lg">
            <div className="flex-shrink-0 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Updated Nutrition Plan</p>
              <p className="text-sm text-gray-600">March 18, 2025 • 2:15 PM</p>
            </div>
          </div>
          <div className="flex items-start p-3 border-l-4 border-purple-400 bg-purple-50 rounded-r-lg">
            <div className="flex-shrink-0 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Set New Fitness Goal</p>
              <p className="text-sm text-gray-600">March 15, 2025 • 10:30 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SidebarLayout>
      {profileContent}
    </SidebarLayout>
  );
}