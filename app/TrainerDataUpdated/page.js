"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import instance from "../../utils/axios";

export default function TrainerProfileUpdated() {
  const [trainerData, setTrainerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    age: "",
    bio: "",
    gender: "",
    totalSubscriptions: "",
    yearsOfExperience: "",
    areasOfExpertise: "",
    availabilityStart: "",
    availabilityEnd: "",
    profilePic: "https://via.placeholder.com/150",
    certificates: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [bioEditing, setBioEditing] = useState(false);
  const [personalEditing, setPersonalEditing] = useState(false);
  const [jobEditing, setJobEditing] = useState(false);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const response = await instance.get("/api/v1/users/me");
        console.log("API Response:", response.data);

        if (response.data && response.data.user) {
          const trainer = response.data.user;
          
          // Format date to YYYY-MM-DD for the date input
          const formattedDate = trainer.dateOfBirth ? 
            new Date(trainer.dateOfBirth).toISOString().split('T')[0] : 
            '';
          
          setTrainerData({
            firstName: trainer.firstName || "",
            lastName: trainer.lastName || "",
            email: trainer.email || "",
            dateOfBirth: formattedDate,
            age: calculateAge(trainer.dateOfBirth),
            bio: trainer.bio || "",
            gender: trainer.gender || "",
            totalSubscriptions: trainer.totalSubscriptions || "0",
            yearsOfExperience: trainer.yearsOfExperience || "",
            areasOfExpertise: trainer.areasOfExpertise || "",
            availabilityStart: trainer.availabilityStart || "",
            availabilityEnd: trainer.availabilityEnd || "",
            profilePic: trainer.profilePic || "https://via.placeholder.com/150",
            certificates: trainer.certificates || [],
          });
        } else {
          throw new Error("Invalid trainer data received");
        }
      } catch (error) {
        console.error("Error fetching trainer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainerData();
  }, []);

  // Helper function to calculate age from date of birth
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (section) => {
    try {
      // Create a payload with only the data that needs to be updated
      let updateData = {};
      
      if (section === 'personal') {
        updateData = {
          firstName: trainerData.firstName,
          lastName: trainerData.lastName,
          email: trainerData.email,
          dateOfBirth: trainerData.dateOfBirth
        };
        setPersonalEditing(false);
      } else if (section === 'job') {
        updateData = {
          gender: trainerData.gender,
          totalSubscriptions: trainerData.totalSubscriptions,
          yearsOfExperience: trainerData.yearsOfExperience,
          areasOfExpertise: trainerData.areasOfExpertise,
          availabilityStart: trainerData.availabilityStart,
          availabilityEnd: trainerData.availabilityEnd
        };
        setJobEditing(false);
      } else if (section === 'bio') {
        updateData = {
          bio: trainerData.bio
        };
        setBioEditing(false);
      }
      
      console.log("Updating profile with data:", updateData);
      
      // Send update to API
      const response = await instance.patch("/api/v1/users/me", updateData);

      if (response.data && response.data.user) {
        // Optional: Show success message
        alert('Profile updated successfully');
      } else {
        throw new Error("Error saving trainer data");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('Failed to update profile. Please try again.');
    }
  };
  const navigateToViewProfile = () => {
    router.push('/trainer/profile/view');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Trainer Profile</h1>
      
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
            <button className="mt-2 bg-red-400 hover:bg-red-500 text-white px-4 py-1 rounded-md w-full">
              Change Photo
            </button>
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
              <button onClick={() => setBioEditing(!bioEditing)} className="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            {bioEditing ? (
              <div>
                <textarea
                  name="bio"
                  value={trainerData.bio}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows="4"
                ></textarea>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => handleSave('bio')}
                    className="bg-red-400 hover:bg-red-500 text-white px-4 py-1 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-gray-100 rounded-md min-w-64 min-h-24">
                {trainerData.bio || "No bio provided yet."}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Personal Information</h3>
          <button 
            onClick={() => setPersonalEditing(!personalEditing)}
            className="bg-red-50 text-red-500 p-2 rounded-md hover:bg-red-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={trainerData.firstName}
              onChange={handleChange}
              disabled={!personalEditing}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={trainerData.lastName}
              onChange={handleChange}
              disabled={!personalEditing}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={trainerData.email}
                onChange={handleChange}
                disabled={!personalEditing}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <div className="absolute right-2 top-2 flex">
                <span className="text-xs bg-gray-100 px-1 rounded flex items-center">
                  View for trainees?
                  <input type="checkbox" className="ml-1" />
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Birthday</label>
            <div className="relative">
              <input
                type="date"
                name="dateOfBirth"
                value={trainerData.dateOfBirth}
                onChange={handleChange}
                disabled={!personalEditing}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <div className="absolute right-2 top-2 flex">
                <span className="text-xs bg-gray-100 px-1 rounded flex items-center">
                  View for trainees?
                  <input type="checkbox" className="ml-1" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {personalEditing && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleSave('personal')}
              className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Job Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Job Information</h3>
          <button 
            onClick={() => setJobEditing(!jobEditing)}
            className="bg-red-50 text-red-500 p-2 rounded-md hover:bg-red-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Gender
            </label>
            <input
              type="text"
              name="gender"
              value={trainerData.gender}
              onChange={handleChange}
              disabled={!jobEditing}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Total Subscriptions
            </label>
            <input
              type="number"
              name="totalSubscriptions"
              value={trainerData.totalSubscriptions}
              onChange={handleChange}
              disabled={!jobEditing}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Years of Experience</label>
            <input
              type="text"
              name="yearsOfExperience"
              value={trainerData.yearsOfExperience}
              onChange={handleChange}
              disabled={!jobEditing}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Areas of Expertise</label>
            <input
              type="text"
              name="areasOfExpertise"
              value={trainerData.areasOfExpertise}
              onChange={handleChange}
              disabled={!jobEditing}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Availability Start</label>
            <input
              type="time"
              name="availabilityStart"
              value={trainerData.availabilityStart}
              onChange={handleChange}
              disabled={!jobEditing}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Availability End</label>
            <input
              type="time"
              name="availabilityEnd"
              value={trainerData.availabilityEnd}
              onChange={handleChange}
              disabled={!jobEditing}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {jobEditing && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleSave('job')}
              className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}