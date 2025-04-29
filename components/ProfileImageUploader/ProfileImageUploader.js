'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import instance from '../../utils/axios';

export default function ProfileImageUploader({
  currentImage,
  onImageChange,
  size = 'md',
  editable = true,
  useLocalStorage = false // Added option to use localStorage instead of API
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Size classes mapping
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  };

  // Use the current image as preview if available
  const displayImage = preview || currentImage;

  useEffect(() => {
    // Clean up created object URLs to avoid memory leaks
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    
    // If using localStorage, create a data URL and return it directly
    if (useLocalStorage) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    }
    
    // Otherwise upload to server
    try {
      setIsUploading(true);
      const token = Cookies.get('accessToken');
      if (!token) {
        console.error('No token found in cookies.');
        return null;
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await instance.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Image uploaded successfully:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error uploading image:', error.response?.data || error.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set preview for immediate visual feedback
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Upload the image and get URL
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        // Call the parent component's handler with the new image URL
        onImageChange(imageUrl);
      }
    }
  };

  return (
    <div 
      className={`relative ${sizeClasses[size]} bg-gray-100 rounded-full overflow-hidden flex items-center justify-center cursor-pointer`}
      onClick={handleImageClick}
    >
      {isUploading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-900"></div>
        </div>
      ) : displayImage ? (
        <div className="relative w-full h-full">
          <Image 
            src={displayImage}
            alt="Profile picture"
            fill
            className="object-cover rounded-full"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      {editable && (
        <div className="absolute bottom-0 right-0 bg-purple-900 rounded-full w-8 h-8 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </div>
      )}
      
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
}