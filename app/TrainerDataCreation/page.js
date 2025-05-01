'use client'
import React, { useState, useEffect } from 'react';
import instance from "../../utils/axios";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { FiTrash2, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const CreateProfileTrainer = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    bio: '',
    areasOfExpertise: '',
    availableDays: [],
    yearsOfExperience: '',
    profilePic: '',
    certificates: [],
    pricePerSession: '',
  });

  const [certificate, setCertificate] = useState({
    name: '',
    imageUrl: '',
    url: '',
    expiryDate: '',
    issuingOrganization: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingProfilePic, setIsUploadingProfilePic] = useState(false);
  const [isUploadingCertificateImage, setIsUploadingCertificateImage] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '', icon: null });

  // Check for authentication on component mount
  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    
    if (!accessToken && !refreshToken) {
      router.push('/login');
    }
  }, [router]);

  // Add useEffect to log certificates whenever they change
  useEffect(() => {
    console.log("Current certificates array:", formData.certificates);
  }, [formData.certificates]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for pricePerSession
    if (name === 'pricePerSession') {
      // Remove any non-numeric characters except decimal point
      const numericValue = value.replace(/[^0-9.]/g, '');
      
      // Ensure only one decimal point
      const parts = numericValue.split('.');
      const formattedValue = parts.length > 1 
        ? `${parts[0]}.${parts[1]}` 
        : numericValue;
      
      // Update state only if it's a valid number or empty
      if (formattedValue === '' || !isNaN(parseFloat(formattedValue))) {
        setFormData({ ...formData, [name]: formattedValue });
      }
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleCertificateChange = (e) => {
    const { name, value } = e.target;
    setCertificate({ ...certificate, [name]: value });
  };

  const resetCertificateForm = () => {
    setCertificate({
      name: '',
      imageUrl: '',
      url: '',
      expiryDate: '',
      issuingOrganization: '',
    });
  };

  const showNotification = (message, type) => {
    let icon;
    switch (type) {
      case 'success':
        icon = <FiCheckCircle className="w-5 h-5" />;
        break;
      case 'error':
        icon = <FiAlertCircle className="w-5 h-5" />;
        break;
      default:
        icon = <FiInfo className="w-5 h-5" />;
    }
    
    setNotification({ show: true, message, type, icon });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '', icon: null });
    }, 3000);
  };

  const handleAuthError = (error) => {
    if (error.response?.status === 401 || 
        (error.response?.data?.message && error.response?.data?.message.includes("jwt"))) {
      showNotification("Session expired. Attempting to refresh your session...", "info");
    } else {
      showNotification(error.response?.data?.message || "An error occurred", "error");
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await instance.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);
      
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      showNotification('Failed to upload file', 'error');
      return null;
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploadingProfilePic(true);
      const imageUrl = await handleFileUpload(file);
      if (imageUrl) {
        setFormData(prev => ({ ...prev, profilePic: imageUrl }));
        showNotification('Profile picture uploaded successfully', 'success');
      }
    } catch (error) {
      console.error('Error handling profile picture:', error);
    } finally {
      setIsUploadingProfilePic(false);
    }
  };

  const handleCertificateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploadingCertificateImage(true);
      const imageUrl = await handleFileUpload(file);
      if (imageUrl) {
        setCertificate(prev => ({ ...prev, imageUrl }));
        showNotification('Certificate image uploaded successfully', 'success');
      }
    } catch (error) {
      console.error('Error handling certificate image:', error);
    } finally {
      setIsUploadingCertificateImage(false);
    }
  };

  const handleAvailableDaysChange = (day) => {
    setFormData(prev => {
      const days = prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: days };
    });
  };

  const handleUploadCertificate = async () => {
    if (!certificate.name || !certificate.imageUrl || !certificate.issuingOrganization) {
      showNotification('Please fill required certificate fields', 'error');
      return;
    }
    
    try {
      setIsUploading(true);
      
      const certificatePayload = {
        name: certificate.name,
        imageUrl: certificate.imageUrl,
        url: certificate.url || '',
        issuingOrganization: certificate.issuingOrganization,
        expirationDate: certificate.expiryDate
      };
      
      console.log("Sending certificate payload to API:", certificatePayload);
      
      const response = await instance.post('/api/v1/certificates', certificatePayload);
      console.log("Certificate API response:", response.data);
      
      setFormData(prev => {
        const updatedCertificates = [...prev.certificates, response.data.certificate];
        console.log("Updated certificates array:", updatedCertificates);
        return {
          ...prev,
          certificates: updatedCertificates,
        };
      });
      
      showNotification('Certificate added successfully!', 'success');
      resetCertificateForm();
    } catch (error) {
      console.error('Error uploading certificate:', error.response?.data || error.message);
      showNotification('Failed to add certificate. Please try again.', 'error');
      handleAuthError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeCertificate = (index) => {
    console.log("Removing certificate at index:", index);
    const certificateToRemove = formData.certificates[index];
    console.log("Certificate being removed:", certificateToRemove);
    
    setFormData(prev => {
      const updatedCertificates = prev.certificates.filter((_, i) => i !== index);
      console.log("Certificates after removal:", updatedCertificates);
      return {
        ...prev,
        certificates: updatedCertificates
      };
    });
    showNotification('Certificate removed', 'info');
  };

  const handleSave = async () => {
    if (!formData.bio || !formData.areasOfExpertise || !formData.yearsOfExperience || !formData.pricePerSession) {
      showNotification('Please fill all required fields', 'error');
      return;
    }
    
    try {
      setIsSaving(true);
      const payload = {
        bio: formData.bio,
        areasOfExpertise: formData.areasOfExpertise,
        availableDays: formData.availableDays,
        yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || 0,
        profilePhoto: formData.profilePic,
        pricePerSession: parseFloat(formData.pricePerSession) || 0,
      };

      console.log("Saving profile with payload:", payload);
      
      const response = await instance.patch('/api/v1/users/me', payload);
      console.log("Profile update response:", response.data);
      
      if (response.data && response.data.message === "profile updated successful") {
        showNotification('Profile updated successfully!', 'success');
        
        // Add a small delay to ensure data is saved
        await new Promise(resolve => setTimeout(resolve, 500));
        
        router.push('/trainer/profile/TrainerProfileUpdated');
      } else {
        console.error('Unexpected response:', response.data);
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error updating profile:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      showNotification(error.response?.data?.message || 'Failed to update profile. Please try again.', 'error');
      handleAuthError(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <div className="bg-white">
          {/* Notification Component */}
          {notification.show && (
            <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${
              notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}>
              <div className={`flex items-center p-4 rounded-lg shadow-lg ${
                notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                'bg-blue-50 text-blue-800 border border-blue-200'
              }`}>
                <div className="flex-shrink-0 mr-3">
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#2E0D44] p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Create Trainer Profile</h1>
            <p className="text-gray-200 mt-2 text-base md:text-lg">Complete your profile to start training clients</p>
          </div>
          
          <div className="p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Personal Info */}
              <div className="space-y-8">
                <div className="bg-white">
                  <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4">Personal Information</h2>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-100">
                          {formData.profilePic ? (
                            <img 
                              src={formData.profilePic} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                          {isUploadingProfilePic && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-[#B46B6B] text-white p-2 rounded-full cursor-pointer hover:bg-[#2E0D44] transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePicChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Upload a professional profile picture. Recommended size: 500x500 pixels.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Bio <span className="text-red-500">*</span></label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell clients about yourself and your training approach..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2E0D44] focus:border-[#2E0D44]"
                    />
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Areas of Expertise <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="areasOfExpertise"
                      value={formData.areasOfExpertise}
                      onChange={handleInputChange}
                      placeholder="E.g., Weight Training, Yoga, Nutrition, Cardio"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2E0D44] focus:border-[#2E0D44]"
                    />
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Available Days <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-3">
                      {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleAvailableDaysChange(day)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            formData.availableDays.includes(day)
                              ? 'bg-[#B46B6B] text-white'
                              : 'bg-white text-gray-700 border border-[#B46B6B] hover:bg-[#B46B6B] hover:text-white'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Price Per Session ($) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-500">$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        name="pricePerSession"
                        value={formData.pricePerSession}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2E0D44] focus:border-[#2E0D44]"
                        onKeyPress={(e) => {
                          // Allow only numbers, decimal point, and backspace
                          if (!/[\d.]/.test(e.key) && e.key !== 'Backspace') {
                            e.preventDefault();
                          }
                          // Prevent multiple decimal points
                          if (e.key === '.' && formData.pricePerSession.includes('.')) {
                            e.preventDefault();
                          }
                        }}
                        onPaste={(e) => {
                          // Prevent pasting non-numeric values
                          const pastedData = e.clipboardData.getData('text');
                          if (!/^\d*\.?\d*$/.test(pastedData)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {formData.pricePerSession && !isNaN(formData.pricePerSession) && parseFloat(formData.pricePerSession) > 0 && (
                        <span className="absolute right-4 top-3 text-green-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Enter the price in USD (e.g., 50.00)</p>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Years of Experience <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      placeholder="Enter number of years"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2E0D44] focus:border-[#2E0D44]"
                    />
                  </div>
                </div>
              </div>

              {/* Right Side - Certificates */}
              <div>
                <div className="bg-white">
                  <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4 mb-6">Certificates & Qualifications</h2>
                  
                  {/* Certificate List */}
                  {formData.certificates.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Uploaded Certificates</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {formData.certificates.map((cert, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-100">
                                <img 
                                  src={cert.imageUrl} 
                                  alt={cert.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23EEEEEE'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='20' text-anchor='middle' fill='%23999999' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800">{cert.name}</h4>
                                <p className="text-sm text-gray-500">Issued by: {cert.issuingOrganization}</p>
                                {cert.expirationDate && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    Expires: {new Date(cert.expirationDate).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeCertificate(index)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50"
                              title="Remove certificate"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Add Certificate Form */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Add New Certificate</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Certificate Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="name"
                          value={certificate.name}
                          onChange={handleCertificateChange}
                          placeholder="E.g., Personal Trainer Certification"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Certificate Image <span className="text-red-500">*</span></label>
                        <div className="flex items-center space-x-6">
                          <div className="relative">
                            <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                              {certificate.imageUrl ? (
                                <img 
                                  src={certificate.imageUrl} 
                                  alt="Certificate" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                              {isUploadingCertificateImage && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-[#B46B6B] text-white p-2 rounded-full cursor-pointer hover:bg-[#2E0D44] transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleCertificateUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500">Upload a clear image of your certificate. Recommended size: 800x600 pixels.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Issuing Organization <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="issuingOrganization"
                            value={certificate.issuingOrganization}
                            onChange={handleCertificateChange}
                            placeholder="E.g., ACE, NASM, ISSA"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Expiry Date</label>
                          <input
                            type="date"
                            name="expiryDate"
                            value={certificate.expiryDate}
                            onChange={handleCertificateChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Verification URL (Optional)</label>
                        <input
                          type="text"
                          name="url"
                          value={certificate.url}
                          onChange={handleCertificateChange}
                          placeholder="URL to verify certificate"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      
                      <button
                        onClick={handleUploadCertificate}
                        disabled={isUploading}
                        className="w-full bg-[#2E0D44] hover:bg-opacity-90 text-white py-3 px-6 rounded-lg font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E0D44] disabled:opacity-70 flex items-center justify-center"
                      >
                        {isUploading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding...
                          </>
                        ) : 'Add Certificate'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Save Button */}
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full md:w-auto px-8 py-4 text-lg font-medium rounded-lg text-white bg-[#2E0D44] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E0D44] transition duration-150 ease-in-out disabled:opacity-70 min-w-[200px]"
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfileTrainer;