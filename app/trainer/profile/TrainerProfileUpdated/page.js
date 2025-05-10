"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import instance from "../../../../utils/axios";
import { FiEdit2, FiAward } from "react-icons/fi";
import Link from "next/link";
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function TrainerProfileUpdated() {
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
    availableInterval: {},
    role: "",
    isVerified: false,
  });

  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bioEditing, setBioEditing] = useState(false);
  const [personalEditing, setPersonalEditing] = useState(false);
  const [jobEditing, setJobEditing] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      toast.error('Please login to access this page', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#f44336',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      });
      router.push('/login');
      return;
    }

    fetchTrainerData();
    fetchCertificates();
  }, [router]);

  const fetchTrainerData = async () => {
    try {
      const response = await instance.get("/api/v1/users/me");
      console.log("Fetched user data:", response.data);
      if (response.data && response.data.user) {
        const userData = response.data.user;
        console.log("User profile photo:", userData.profilePhoto);

        // Set the initial state with the profile photo
        setTrainerData((prev) => ({
          ...prev,
          ...userData,
          yearsOfExperience: userData.yearsOfExperience || 0,
          pricePerSession: userData.pricePerSession || 0,
          profilePhoto:
            userData.profilePhoto ||
            "https://res.cloudinary.com/dmbd60etr/image/upload/v1746098637/wpdzsxnjj0wvfetokyac.jpg",
        }));
      }
    } catch (error) {
      console.error("Error fetching trainer data:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#f44336',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
        });
        router.push('/login');
      } else {
        toast.error('Failed to fetch trainer data. Please try again.', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#f44336',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
        });
      }
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await instance.get("/api/v1/certificates");
      console.log("Certificates response:", response.data);
      // Check if the data is nested under 'certificate' property
      const certificatesData =
        response.data?.certificate || response.data || [];
      console.log("Processed certificates:", certificatesData); // Debug log
      setCertificates(certificatesData);
    } catch (error) {
      console.error("Error fetching certificates:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#f44336',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
        });
        router.push('/login');
      } else {
        toast.error('Failed to fetch certificates. Please try again.', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#f44336',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
        });
      }
      setCertificates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await instance.post('/api/v1/upload', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!uploadResponse.data || !uploadResponse.data.data) {
        throw new Error('Failed to get image URL from upload');
      }

      const imageUrl = uploadResponse.data.data;
      
      const updateResponse = await instance.patch("/api/v1/users/me", {
        profilePhoto: imageUrl
      });

      if (updateResponse.data && updateResponse.data.user) {
        setTrainerData(prev => ({
          ...prev,
          profilePhoto: imageUrl,
        }));

        toast.success('Profile image updated successfully!', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#4CAF50',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
        });
      } else {
        throw new Error('Failed to update profile');
      }

    } catch (error) {
      console.error("Error updating profile image:", error);
      toast.error('Failed to update profile image. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#f44336',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (section) => {
    try {
      let updateData = {};

      if (section === "personal") {
        updateData = {
          firstName: trainerData.firstName,
          lastName: trainerData.lastName,
          phoneNumber: trainerData.phoneNumber,
          dateOfBirth: trainerData.dateOfBirth,
        };
      } else if (section === "job") {
        updateData = {
          yearsOfExperience: trainerData.yearsOfExperience,
          pricePerSession: trainerData.pricePerSession,
          availableDays: trainerData.availableDays,
          availableInterval: trainerData.availableInterval,
        };
      } else if (section === "bio") {
        updateData = {
          bio: trainerData.bio,
        };
      }

      const response = await instance.patch("/api/v1/users/me", updateData);
      if (response.data && response.data.user) {
        setTrainerData(prev => ({ ...prev, ...response.data.user }));
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} information updated successfully!`, {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#4CAF50',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#f44336',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      });
    }
  };

  const handleCertificateEdit = async (certId, updatedData) => {
    try {
      const response = await instance.patch(
        `/api/v1/certificates/${certId}`,
        updatedData
      );
      if (response.data) {
        fetchCertificates(); // Refresh certificates after update
      }
    } catch (error) {
      console.error("Error updating certificate:", error);
    }
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    const isValid = url.startsWith("http://") || url.startsWith("https://");
    console.log("Checking image URL:", url, "isValid:", isValid);
    return isValid;
  };

  const generateUniqueKey = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const getSafeImageUrl = (url) => {
    if (!url) return url;
    return url.replace(/^http:\/\//, 'https://');
  };

  // Add useEffect to log state changes
  useEffect(() => {
    console.log("Current trainerData:", trainerData);
  }, [trainerData]);

  // Profile Image Component
  const ProfileImage = () => {
    const [imgError, setImgError] = useState(false);
    const defaultImage = "https://res.cloudinary.com/dmbd60etr/image/upload/v1746098637/wpdzsxnjj0wvfetokyac.jpg";
    const imageUrl = !imgError && trainerData.profilePhoto ? trainerData.profilePhoto : defaultImage;
    
    return (
      <div className="relative w-24 h-24">
        <Image
          src={getSafeImageUrl(imageUrl)}
          alt="Profile"
          width={96}
          height={96}
          className="object-cover w-full h-full rounded-lg"
          onError={() => {
            console.log('Image failed to load, using default');
            setImgError(true);
          }}
          priority
        />
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-full mx-auto">
        <div className="bg-white dark:bg-[#2E0D44]">
          <div className="bg-[#2E0D44] p-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Update Trainer Profile
              </h1>
              <p className="text-gray-200 mt-2 text-base md:text-lg">
                Edit your profile information
              </p>
            </div>
            <button
              onClick={() => router.push("/trainer/profile/view")}
              className="px-6 py-3 bg-[#B46B6B] text-white rounded-lg hover:bg-opacity-90 transition-all duration-200"
            >
              View Profile
            </button>
          </div>

          {/* Profile Header */}
          <div className="bg-white dark:bg-[#7946bb3a] rounded-lg shadow-md p-6 mb-6">
            <div className="flex">
              <div className="mr-6">
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                  <ProfileImage />
                </div>
                <label className="mt-2 bg-red-400 hover:bg-red-500 text-white px-4 py-1 rounded-md w-full block text-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  Change Photo
                </label>
              </div>

              {/* Bio Section */}
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold">Bio</h4>
                  <button
                    onClick={() => setBioEditing(!bioEditing)}
                    className="text-red-400"
                  >
                    <FiEdit2 />
                  </button>
                </div>
                {bioEditing ? (
                  <div>
                    <textarea
                      name="bio"
                      value={trainerData.bio || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 "
                      rows="4"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => handleSave("bio")}
                        className="bg-red-400 hover:bg-red-500 text-white px-4 py-1 rounded-md"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-200">
                    {trainerData.bio || "No bio provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-[#7946bb3a]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Personal Information</h3>
              <button
                onClick={() => setPersonalEditing(!personalEditing)}
                className="text-red-400"
              >
                <FiEdit2 />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={trainerData.firstName || ""}
                  onChange={handleChange}
                  disabled={!personalEditing}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={trainerData.lastName || ""}
                  onChange={handleChange}
                  disabled={!personalEditing}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={trainerData.phoneNumber || ""}
                  onChange={handleChange}
                  disabled={!personalEditing}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={trainerData.email || ""}
                  disabled
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
            {personalEditing && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleSave("personal")}
                  className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Job Information */}
          <div className="bg-white dark:bg-[#7946bb3a] rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Job Information</h3>
              <button
                onClick={() => setJobEditing(!jobEditing)}
                className="text-red-400"
              >
                <FiEdit2 />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={trainerData.yearsOfExperience || 0}
                  onChange={handleChange}
                  disabled={!jobEditing}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block  text-gray-700 dark:text-gray-300  font-bold mb-2">
                  Price Per Session
                </label>
                <input
                  type="number"
                  name="pricePerSession"
                  value={trainerData.pricePerSession || 0}
                  onChange={handleChange}
                  disabled={!jobEditing}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block  text-gray-700 dark:text-gray-300 font-bold mb-2">
                  Rating
                </label>
                <input
                  type="text"
                  value={trainerData.avgRating || "No ratings yet"}
                  disabled
                  className="w-full border border-gray-300 rounded-md p-2 "
                />
              </div>
              <div>
                <label className="block  text-gray-700 dark:text-gray-300 font-bold mb-2">
                  Available Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((day) => {
                    const shortDay = day.slice(0, 3);
                    return (
                      <button
                        key={day}
                        onClick={() => {
                          if (jobEditing) {
                            const updatedDays =
                              trainerData.availableDays.includes(day)
                                ? trainerData.availableDays.filter(
                                    (d) => d !== day
                                  )
                                : [...trainerData.availableDays, day];
                            setTrainerData((prev) => ({
                              ...prev,
                              availableDays: updatedDays,
                            }));
                          }
                        }}
                        disabled={!jobEditing}
                        className={`px-3 py-1 rounded-md text-sm ${
                          trainerData.availableDays.includes(day)
                            ? "bg-red-400 text-white"
                            : "bg-gray-100 text-gray-600"
                        } ${jobEditing ? "cursor-pointer" : "cursor-default"}`}
                      >
                        {shortDay}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {jobEditing && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleSave("job")}
                  className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Certificates */}
          <div className="bg-white dark:bg-[#7946bb3a] rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Certificates</h3>
              <Link
                href="/trainer/certificates"
                className="text-red-400 hover:text-red-500 flex items-center gap-2"
              >
                <FiAward />
                Manage Certificates
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {certificates.map((cert) => (
                <div
                  key={`cert-${cert._id}-${Date.now()}`}
                  className="border rounded-lg p-4 flex items-start space-x-4"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {isValidImageUrl(cert.imageUrl) ? (
                      <Image
                        src={getSafeImageUrl(cert.imageUrl)}
                        alt={cert.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <FiAward className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold">{cert.name}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Issued by: {cert.issuingOrganization || "Not specified"}
                    </p>
                    {isValidImageUrl(cert.url) && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-500 text-sm mt-1 inline-block"
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
