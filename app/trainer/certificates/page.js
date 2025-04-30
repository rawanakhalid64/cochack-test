"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiEdit2, FiAward, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import instance from "../../../utils/axios";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    imageUrl: "",
    url: "",
    issuingOrganization: ""
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await instance.get('/api/v1/certificates');
      const certificatesData = response.data?.certificate || response.data || [];
      console.log("Certificates fetched:", certificatesData);
      setCertificates(certificatesData);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    if (url === 'hhhh' || url === 'kkkkkkkkkkk' || url === 'cri') return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const handleImageUpload = async (e, certId) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    if (file.size > maxSize) {
      alert('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const loadingElement = document.getElementById(`loading-${certId}`);
      if (loadingElement) loadingElement.style.display = 'flex';

      // First upload the image
      const uploadResponse = await instance.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (uploadResponse.data && uploadResponse.data.data) {
        const imageUrl = uploadResponse.data.data;
        
        // Then update the certificate with the new image URL
        await instance.patch(`/api/v1/certificates/${certId}`, {
          ...editForm,
          imageUrl: imageUrl
        });

        // Update local state
        setEditForm(prev => ({ ...prev, imageUrl }));
        fetchCertificates(); // Refresh the certificates list
      }
    } catch (error) {
      console.error("Error handling image:", error);
      let errorMessage = 'Failed to process image. ';
      
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage += 'Invalid request. Please check the image file.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error. Please try again later.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      const loadingElement = document.getElementById(`loading-${certId}`);
      if (loadingElement) loadingElement.style.display = 'none';
    }
  };

  const handleEdit = (cert) => {
    setEditingId(cert._id);
    setEditForm({
      name: cert.name || "",
      imageUrl: isValidImageUrl(cert.imageUrl) ? cert.imageUrl : "",
      url: cert.url || "",
      issuingOrganization: cert.issuingOrganization || ""
    });
  };

  const handleSave = async (certId) => {
    try {
      await instance.patch(`/api/v1/certificates/${certId}`, editForm);
      await fetchCertificates(); // Refresh the list
      setEditingId(null);
      setEditForm({
        name: "",
        imageUrl: "",
        url: "",
        issuingOrganization: ""
      });
    } catch (error) {
      console.error("Error updating certificate:", error);
      alert("Failed to update certificate");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: "",
      imageUrl: "",
      url: "",
      issuingOrganization: ""
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Certificates</h2>
      <div className="grid gap-6">
        {certificates.map((cert) => (
          <div 
            key={`cert-${cert._id}-${Date.now()}`}
            className="bg-white rounded-lg shadow-md p-6"
          >
            {editingId === cert._id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="flex justify-between">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md p-2 mr-4"
                    placeholder="Certificate Name"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(cert._id)}
                      className="text-green-500 hover:text-green-600"
                    >
                      <FiSave className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-500 hover:text-gray-600"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-32">
                    <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden relative">
                      {isValidImageUrl(editForm.imageUrl) ? (
                        <Image
                          src={editForm.imageUrl}
                          alt={editForm.name}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiAward className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      {/* Loading Overlay */}
                      <div 
                        id={`loading-${cert._id}`} 
                        className="absolute inset-0 bg-black bg-opacity-50 hidden items-center justify-center"
                      >
                        <div className="text-white text-sm">Uploading...</div>
                      </div>
                    </div>
                    <label className="mt-2 bg-red-400 hover:bg-red-500 text-white px-4 py-1 rounded-md w-full block text-center cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={(e) => handleImageUpload(e, cert._id)}
                        className="hidden"
                      />
                      Change Image
                    </label>
                  </div>
                  <div className="flex-grow space-y-4">
                    <input
                      type="text"
                      value={editForm.issuingOrganization}
                      onChange={(e) => setEditForm(prev => ({ ...prev, issuingOrganization: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="Issuing Organization"
                    />
                    <input
                      type="url"
                      value={editForm.url}
                      onChange={(e) => setEditForm(prev => ({ ...prev, url: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="Certificate URL"
                    />
                  </div>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-start space-x-4">
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {isValidImageUrl(cert.imageUrl) ? (
                    <Image
                      src={cert.imageUrl}
                      alt={cert.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiAward className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">{cert.name}</h3>
                      <p className="text-sm text-gray-600">Issued by: {cert.issuingOrganization || 'Not specified'}</p>
                    </div>
                    <button
                      onClick={() => handleEdit(cert)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                  </div>
                  {isValidImageUrl(cert.url) && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-400 hover:text-red-500 text-sm mt-2 inline-block"
                    >
                      View Certificate →
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}