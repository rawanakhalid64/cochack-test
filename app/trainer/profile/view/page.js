"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import instance from "../../../../utils/axios";

export default function TrainerProfileView() {
  const router = useRouter();
  const [trainerData, setTrainerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    bio: "",
    gender: "",
    totalSubscriptions: "",
    yearsOfExperience: "",
    areasOfExpertise: "",
    availabilityStart: "",
    availabilityEnd: "",
    profilePic: "https://via.placeholder.com/150",
  });
  
  const [isLoading, setIsLoading] = useState(true);

  const defaultProfileImage = "/default-profile.png";
  const defaultCertificateImage = "/default-certificate.png";

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const response = await instance.get("/api/v1/users/me");
        
        if (response.data && response.data.user) {
          const trainer = response.data.user;
          
          setTrainerData({
            firstName: trainer.firstName || "",
            lastName: trainer.lastName || "",
            email: trainer.email || "",
            age: calculateAge(trainer.dateOfBirth),
            bio: trainer.bio || "",
            gender: trainer.gender || "",
            totalSubscriptions: trainer.totalSubscriptions || "0",
            yearsOfExperience: trainer.yearsOfExperience || "",
            areasOfExpertise: trainer.areasOfExpertise || "",
            availabilityStart: trainer.availabilityStart || "",
            availabilityEnd: trainer.availabilityEnd || "",
            profilePic: trainer.profilePic || "https://via.placeholder.com/150",
          });
        }
      } catch (error) {
        console.error("Error fetching trainer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainerData();
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return "Not specified";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  const navigateToEditProfile = () => {
    router.push('/trainer/profile/TrainerProfileUpdated');
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header with Pink Background */}
      <div className="bg-[#FF8B8B] h-48 relative">
        {/* Edit Profile Button */}
        <div className="absolute top-4 right-8">
          <button 
            onClick={navigateToEditProfile}
            className="px-6 py-3 bg-[#B46B6B] text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md"
          >
            Edit Profile
          </button>
        </div>
        
        {/* Profile Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex items-end space-x-6">
            <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={isValidImageUrl(trainerData.profilePic) ? trainerData.profilePic : defaultProfileImage}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover w-full h-full"
                onError={(e) => {
                  console.error('Error loading image:', trainerData.profilePic);
                  e.target.src = defaultProfileImage;
                }}
              />
            </div>
            <div className="mb-4 text-white">
              <h1 className="text-3xl font-bold">{`${trainerData.firstName} ${trainerData.lastName}`}</h1>
              <p className="text-lg">{trainerData.yearsOfExperience} years experience</p>
              <p className="text-sm">Member since {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Bio Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Bio</h2>
          <p className="text-gray-600">{trainerData.bio || "No bio available"}</p>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Personal Information</h3>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2">First Name</div>
              <div className="p-2 bg-gray-50 rounded">{trainerData.firstName}</div>
            </div>
            <div>
              <div className="font-semibold mb-2">Last Name</div>
              <div className="p-2 bg-gray-50 rounded">{trainerData.lastName}</div>
            </div>
            <div>
              <div className="font-semibold mb-2">Email</div>
              <div className="p-2 bg-gray-50 rounded">{trainerData.email}</div>
            </div>
            <div>
              <div className="font-semibold mb-2">Gender</div>
              <div className="p-2 bg-gray-50 rounded">{trainerData.gender}</div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Professional Information</h3>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2">Total Subscriptions</div>
              <div className="p-2 bg-gray-50 rounded">{trainerData.totalSubscriptions}</div>
            </div>
            <div>
              <div className="font-semibold mb-2">Years of Experience</div>
              <div className="p-2 bg-gray-50 rounded">{trainerData.yearsOfExperience}</div>
            </div>
            <div>
              <div className="font-semibold mb-2">Areas of Expertise</div>
              <div className="p-2 bg-gray-50 rounded">{trainerData.areasOfExpertise}</div>
            </div>
            <div>
              <div className="font-semibold mb-2">Availability</div>
              <div className="p-2 bg-gray-50 rounded">
                {trainerData.availabilityStart} - {trainerData.availabilityEnd}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}