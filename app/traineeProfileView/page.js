"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SidebarLayout from "../../components/SidebarLayout/SidebarLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../Redux/userSlice";
import instance from "../../utils/axios";
import Image from "next/image";

export default function TraineeProfileView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userDataState = useSelector(state => state.user.userData);
  const isLoading = useSelector(state => state.user.isLoading);
  
  // State to handle client-side rendering of profile image
  const [imageLoaded, setImageLoaded] = useState(false);
  // State to store the profile image URL
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [userData, setUserData] = useState(null);

  // Fetch fresh user data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get('/api/v1/users/me');
        console.log('Fetched fresh user data:', response.data);
        if (response.data && response.data.user) {
          setUserData(response.data.user);
          if (response.data.user.profilePhoto) {
            setProfileImageUrl(response.data.user.profilePhoto);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  // Set imageLoaded to true after hydration is complete
  useEffect(() => {
    setImageLoaded(true);
  }, []);

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
    if (!userData?.weight || !userData?.height) return null;
    
    // Convert height from cm to meters
    const heightInMeters = userData.height / 100;
    // Calculate BMI
    const bmi = (userData.weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    // Determine BMI category
    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi >= 18.5 && bmi < 25) category = "Normal weight";
    else if (bmi >= 25 && bmi < 30) category = "Overweight";
    else category = "Obesity";
    
    return { value: bmi, category };
  };

  const bmi = calculateBMI();

  // Profile Image Component
  const ProfileImage = () => {
    if (!imageLoaded) {
      return (
        <div className="w-full h-full bg-gray-200 rounded-lg"></div>
      );
    }
    
    return (
      <div className="relative w-full h-full">
        <Image
          src={profileImageUrl || "https://res.cloudinary.com/dmbd60etr/image/upload/v1746098637/wpdzsxnjj0wvfetokyac.jpg"}
          alt="Profile"
          fill
          className="object-cover rounded-lg"
          onError={(e) => {
            console.error('Image load error:', e);
            setProfileImageUrl("https://res.cloudinary.com/dmbd60etr/image/upload/v1746098637/wpdzsxnjj0wvfetokyac.jpg");
          }}
        />
      </div>
    );
  };

  // Use userData instead of userDataState
  const displayData = userData || userDataState;

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
                {displayData?.firstName || "N/A"} {displayData?.lastName || ""}
              </h2>
              <div className="text-gray-600 mb-4">
                <p>{getAge(displayData?.dateOfBirth)} years old • {displayData?.job || "Not specified"}</p>
                <p>Member since {new Date().getFullYear()}</p>
              </div>
              <div className="flex flex-wrap gap-3 mb-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {displayData?.fitnessLevel || "Fitness level not set"}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Goal: {displayData?.fitnessGoal || "No goal set"}
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
              <span className="font-medium">{displayData?.height ? `${displayData.height} cm` : "Not provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight</span>
              <span className="font-medium">{displayData?.weight ? `${displayData.weight} kg` : "Not provided"}</span>
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
              <span className="font-medium text-right">{displayData?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Birthdate</span>
              <span className="font-medium">{formatBirthdate(displayData?.dateOfBirth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Occupation</span>
              <span className="font-medium">{displayData?.job || "Not specified"}</span>
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
            {displayData?.healthCondition && displayData.healthCondition.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displayData.healthCondition.map((condition, index) => (
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
            {displayData?.allergy && displayData.allergy.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displayData.allergy.map((allergy, index) => (
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
    </div>
  );

  return <SidebarLayout>{profileContent}</SidebarLayout>;
}