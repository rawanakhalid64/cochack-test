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
    dateOfBirth: "",
    phoneNumber: "",
    bio: "",
    yearsOfExperience: 0,
    pricePerSession: 0,
    profilePhoto: "",
    availableDays: [],
    role: "",
    avgRating: 0
  });

  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrainerData();
    fetchCertificates();
  }, []);

  const fetchTrainerData = async () => {
    try {
      const response = await instance.get("/api/v1/users/me");
      console.log("Fetched user data:", response.data);
      if (response.data && response.data.user) {
        setTrainerData(prev => ({
          ...prev,
          ...response.data.user,
          profilePhoto: response.data.user.profilePhoto || "https://res.cloudinary.com/dmbd60etr/image/upload/v1746098637/wpdzsxnjj0wvfetokyac.jpg"
        }));
      }
    } catch (error) {
      console.error("Error fetching trainer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await instance.get("/api/v1/certificates");
      const certificatesData = response.data?.certificate || response.data || [];
      setCertificates(certificatesData);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      setCertificates([]);
    }
  };

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

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return 'Not available';
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const category = bmi < 18.5 ? '(Underweight)' : 
                    bmi < 25 ? '(Normal)' :
                    bmi < 30 ? '(Overweight)' : '(Obese)';
    return `${bmi.toFixed(1)} ${category}`;
  };

  const navigateToEditProfile = () => {
    router.push("/trainer/profile/TrainerProfileUpdated");
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const defaultProfileImage = "https://res.cloudinary.com/dmbd60etr/image/upload/v1746098637/wpdzsxnjj0wvfetokyac.jpg";

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Profile Header with Pink Background */}
      <div className="bg-[#FF8B8B] h-48 relative">
        <div className="absolute top-4 right-8">
          <button 
            onClick={navigateToEditProfile}
            className="px-6 py-3 bg-[#B46B6B] text-white rounded-lg hover:bg-opacity-90 transition-all duration-200"
          >
            Edit Profile
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex items-end space-x-6">
            <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white">
              <Image
                src={isValidImageUrl(trainerData.profilePhoto) ? trainerData.profilePhoto : defaultProfileImage}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover w-full h-full"
                onError={(e) => {
                  console.error('Error loading image:', trainerData.profilePhoto);
                  e.target.src = defaultProfileImage;
                }}
              />
            </div>
            <div className="mb-4 text-white">
              <h1 className="text-3xl font-bold">{`${trainerData.firstName} ${trainerData.lastName}`}</h1>
              <p className="text-lg">{trainerData.yearsOfExperience} years experience • {trainerData.role}</p>
              <p className="text-sm">Member since {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Bio Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Bio</h2>
          <p className="text-gray-600">{trainerData.bio || "No bio provided"}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Personal Information Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">First Name</span>
                <span className="font-medium">{trainerData.firstName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Name</span>
                <span className="font-medium">{trainerData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{trainerData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium">{trainerData.phoneNumber || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Job Information Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Job Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium">{trainerData.yearsOfExperience} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price/Session</span>
                <span className="font-medium">${trainerData.pricePerSession}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating</span>
                <span className="font-medium">{trainerData.avgRating || 'No ratings yet'}</span>
              </div>
            </div>
          </div>

          {/* Available Days Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Available Days</h2>
            <div className="flex flex-wrap gap-2">
              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                <span
                  key={day}
                  className={`px-3 py-1 rounded-full text-sm ${
                    trainerData.availableDays.includes(day)
                      ? 'bg-[#FF8B8B] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {day.slice(0, 3)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Certificates</h2>
            <div className="grid grid-cols-1 gap-4">
              {certificates.map((cert) => (
                <div 
                  key={cert._id} 
                  className="border rounded-lg p-4 flex items-start space-x-4"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {isValidImageUrl(cert.imageUrl) ? (
                      <Image
                        src={cert.imageUrl}
                        alt={cert.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          console.error('Error loading certificate image:', cert.imageUrl);
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8m-2 12a2 2 0 01-2-2v-1'/%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8m-2 12a2 2 0 01-2-2v-1" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold">{cert.name}</h4>
                    <p className="text-sm text-gray-600">Issued by: {cert.issuingOrganization || 'Not specified'}</p>
                    {isValidImageUrl(cert.url) && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF8B8B] hover:text-[#B46B6B] text-sm mt-1 inline-block"
                      >
                        View Certificate →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}