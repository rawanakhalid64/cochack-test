// app/trainer/profile/view/page.js
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trainer Profile</h1>
        <button 
          onClick={navigateToEditProfile}
          className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Edit Profile
        </button>
      </div>
      
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex">
          <div className="mr-6">
            <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
              <Image
                src={trainerData.profilePic}
                alt="Trainer Profile Picture"
                width={96}
                height={96}
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
          <div>
            <div className="mb-2">
              <div className="font-semibold">Name</div>
              <div>{trainerData.firstName} {trainerData.lastName}</div>
            </div>
            <div>
              <div className="font-semibold">Age</div>
              <div>{trainerData.age}</div>
            </div>
          </div>
          <div className="ml-auto">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold">Bio</h4>
            </div>
            <div className="p-4 border border-gray-100 rounded-md min-w-64 min-h-24">
              {trainerData.bio || "No bio provided yet."}
            </div>
          </div>
        </div>
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
  );
}