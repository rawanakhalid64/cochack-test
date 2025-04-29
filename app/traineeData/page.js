'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import instance from "../../utils/axios";
import { useSelector } from "react-redux";

export default function TraineeData() {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    customGoal: '',
    selectedGoal: '',
    fitnessLevel: '',
    healthCondition: [],
    allergies: [],
    job: '',
  });
  // Keep the image state separate from user data
  const [uploadedImage, setUploadedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [newHealthCondition, setNewHealthCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [healthConditions, setHealthConditions] = useState([]);
  const [allergiesList, setAllergiesList] = useState([]);
  const [hasHealthCondition, setHasHealthCondition] = useState(false);
  const [hasAllergies, setHasAllergies] = useState(false);
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);
  const [showWeightUnit, setShowWeightUnit] = useState('Kg');
  const [showHeightDropdown, setShowHeightDropdown] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const weightDropdownRef = useRef(null);
  const heightDropdownRef = useRef(null);

  const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced'];
  
  const weights = Array.from({ length: 111 }, (_, i) => 40 + i);
  
  const heights = Array.from({ length: 51 }, (_, i) => 150 + i);
  
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!userData || !token) {
          console.error("User not logged in or token missing.");
          return;
        }

        const url = `/api/v1/users/me`;
        const response = await instance.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHealthConditions(response.data.healthCondition || []);
        setAllergiesList(response.data.allergy || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const handleClickOutside = (event) => {
      if (weightDropdownRef.current && !weightDropdownRef.current.contains(event.target)) {
        setShowWeightDropdown(false);
      }
      if (heightDropdownRef.current && !heightDropdownRef.current.contains(event.target)) {
        setShowHeightDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Separate upload function that only handles the upload
  const uploadImage = async (file) => {
    if (!file) return null;
    
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
      // Store the image URL returned from the API
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
      setPreview(URL.createObjectURL(file));
      
      // Upload the image and get URL
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setUploadedImage(imageUrl);
        // Store the image URL in cookies or localStorage to access in the profile page
        localStorage.setItem('uploadedProfileImage', imageUrl);
      }
    }
  };

  const handleAddHealthCondition = () => {
    if (!newHealthCondition) return;
    setHealthConditions((prev) => [...prev, newHealthCondition]);
    setNewHealthCondition('');
  };

  const handleAddAllergy = () => {
    if (!newAllergy) return;
    setAllergiesList((prev) => [...prev, newAllergy]);
    setNewAllergy('');
  };

  const handleSubmit = async () => {
    const token = Cookies.get('accessToken');

    if (!token) {
      console.error('No token found in cookies.');
      return;
    }

    try {
      const finalGoal = formData.selectedGoal === 'Other' ? formData.customGoal : formData.selectedGoal;

      const payload = {
        weight: Number(formData.weight),
        height: Number(formData.height),
        job: formData.job,
        fitnessLevel: formData.fitnessLevel,
        fitnessGoal: finalGoal,
        healthCondition: healthConditions,
        allergy: allergiesList,
      };

      // Don't include the image URL in the user data update
      const response = await instance.patch('/api/v1/users/me', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Profile updated:', response.data);
      router.push('/traineeProfileUpdated');
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
    }
  };

  const goalsList = [
    { name: 'Lose Weight', imageUrl: 'https://res.cloudinary.com/dvgqyejfc/image/upload/v1741444499/weight-loss_1_a3ydhe.png' },
    { name: 'Gain Muscles', imageUrl: 'https://res.cloudinary.com/dvgqyejfc/image/upload/v1741444513/muscle-arm-fitness_1_uiri8r.png' },
    { name: 'Weight-lifting', imageUrl: 'https://res.cloudinary.com/dvgqyejfc/image/upload/v1741444526/weight-lifter_2_aka3t0.png' },
    { name: 'Diet', imageUrl: 'https://res.cloudinary.com/dvgqyejfc/image/upload/v1741444535/6643377_balance_diet_fitness_protein_vegetable_icon_1_ugzh0h.jpg' },
    { name: 'Other', imageUrl: 'https://res.cloudinary.com/dvgqyejfc/image/upload/v1741444544/menu_1_synx3b.jpg' },
  ];

  const renderWeightDropdown = () => {
    return (
      <div className='fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50'>
        <div className='bg-white w-full max-w-sm rounded-xl shadow-lg overflow-hidden' ref={weightDropdownRef}>
          <div className='flex justify-between items-center p-4 border-b'>
            <button onClick={() => setShowWeightDropdown(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className='text-xl font-semibold'>Select Your Weight</div>
            <button onClick={() => {
              setShowWeightDropdown(false);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-900">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </div>

          <div className='h-80 overflow-y-auto'>
            {weights.map(weight => (
              <div 
                key={weight} 
                className={`flex justify-between px-6 py-3 border-b ${formData.weight === weight ? 'bg-gray-100' : ''}`}
                onClick={() => {
                  setFormData(prev => ({ ...prev, weight }));
                }}
              >
                <div className='text-lg'>{weight}</div>
                <div className='text-lg'>{showWeightUnit}</div>
              </div>
            ))}
          </div>

          <div className='flex border-t'>
            <button 
              className={`flex-1 py-3 text-center font-semibold ${showWeightUnit === 'lbs' ? 'text-black' : 'text-gray-400'}`}
              onClick={() => setShowWeightUnit('lbs')}
            >
              lbs
            </button>
            <button 
              className={`flex-1 py-3 text-center font-semibold ${showWeightUnit === 'Kg' ? 'text-black' : 'text-gray-400'}`}
              onClick={() => setShowWeightUnit('Kg')}
            >
              Kg
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderHeightDropdown = () => {
    return (
      <div className='fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50'>
        <div className='bg-white w-full max-w-sm rounded-xl shadow-lg overflow-hidden' ref={heightDropdownRef}>
          <div className='flex justify-between items-center p-4 border-b'>
            <button onClick={() => setShowHeightDropdown(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className='text-xl font-semibold'>Select Your Height</div>
            <button onClick={() => {
              setShowHeightDropdown(false);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-900">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </div>

          <div className='h-80 overflow-y-auto'>
            {heights.map(height => (
              <div 
                key={height} 
                className={`flex justify-between px-6 py-3 border-b ${formData.height === height ? 'bg-gray-100' : ''}`}
                onClick={() => {
                  setFormData(prev => ({ ...prev, height }));
                }}
              >
                <div className='text-lg'>{height}</div>
                <div className='text-lg'>cm</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='max-w-4xl mx-auto bg-white p-6'>
      <h1 className='text-2xl text-center font-bold mb-8'>Please upload your picture</h1>
      
      {/* Profile Picture Upload */}
      <div className='flex justify-center mb-8'>
        <div className='relative w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center'>
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-900"></div>
            </div>
          ) : preview ? (
            <Image src={preview} alt='Preview' fill className='object-cover rounded-md' />
          ) : (
            <label className='cursor-pointer'>
              <div className='flex items-center justify-center'>
                <div className='w-6 h-6 bg-purple-900 rounded-full flex items-center justify-center'>
                  <span className='text-white text-lg'>+</span>
                </div>
              </div>
              <input type='file' accept="image/*" className='hidden' onChange={handleImageUpload} />
            </label>
          )}
        </div>
      </div>

      {/* Goals Section */}
      <div className='mb-8'>
        <h2 className='text-xl font-bold mb-4'>What are your goals?</h2>
        <div className='grid grid-cols-5 gap-4 mb-4'>
          {goalsList.map((goal) => (
            <div 
              key={goal.name}
              onClick={() => setFormData((prev) => ({
                ...prev,
                selectedGoal: goal.name
              }))}
              className={`border border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer relative ${
                formData.selectedGoal === goal.name ? 'border-purple-800' : ''
              }`}
            >
              {formData.selectedGoal === goal.name && (
                <div className='absolute top-2 left-2 w-5 h-5 bg-purple-800 rounded-full flex items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
              <div className="mb-2 w-10 h-10 flex items-center justify-center">
                <Image 
                  src={goal.imageUrl} 
                  alt={goal.name} 
                  width={24} 
                  height={24} 
                  className="object-contain"
                />
              </div>
              <div className="text-sm text-center">{goal.name}</div>
            </div>
          ))}
        </div>
        
        {/* Custom Goal Input */}
        {formData.selectedGoal === 'Other' && (
          <div className='mt-4'>
            <input
              type='text'
              placeholder='Enter your custom goal'
              className='w-full p-3 border border-gray-300 rounded-md'
              value={formData.customGoal}
              onChange={(e) => setFormData(prev => ({ ...prev, customGoal: e.target.value }))}
            />
          </div>
        )}
      </div>

      {/* Age, Height, Weight Section */}
      <div className='grid grid-cols-3 gap-6 mb-8'>
        <div>
          <h2 className='text-xl font-bold mb-4'>What is your Job?</h2>
          <input
            type='text'
            placeholder=''
            className='w-full p-3 bg-gray-100 rounded-md'
            onChange={(e) => setFormData({ ...formData, job: e.target.value })}
          />
        </div>
        
        {/* Height Dropdown */}
        <div>
          <h2 className='text-xl font-bold mb-4'>What is your height?</h2>
          <div className='relative'>
            <div 
              className='w-full p-3 bg-gray-100 rounded-md flex justify-between cursor-pointer'
              onClick={() => setShowHeightDropdown(!showHeightDropdown)}
            >
              <span>{formData.height ? `${formData.height} cm` : 'Choose your height'}</span>
              <span>⌄</span>
            </div>
          </div>
        </div>
        
        {/* Weight Dropdown */}
        <div>
          <h2 className='text-xl font-bold mb-4'>What is your weight?</h2>
          <div className='relative'>
            <div 
              className='w-full p-3 bg-gray-100 rounded-md flex justify-between cursor-pointer'
              onClick={() => setShowWeightDropdown(!showWeightDropdown)}
            >
              <span>{formData.weight ? `${formData.weight} ${showWeightUnit}` : 'Choose your weight'}</span>
              <span>⌄</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fitness Level Section */}
      <div className='mb-8'>
        <h2 className='text-xl font-bold mb-4'>What is your current fitness level?</h2>
        <div className='grid grid-cols-3 gap-4'>
          {fitnessLevels.map((level) => (
            <button
              key={level}
              onClick={() => setFormData({ ...formData, fitnessLevel: level })}
              className={`p-3 border border-gray-300 rounded-md relative ${
                formData.fitnessLevel === level ? 'border-purple-900' : ''
              }`}
            >
              {formData.fitnessLevel === level && (
                <div className='absolute top-2 left-2 w-5 h-5 bg-purple-900 rounded-full flex items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Health Conditions Section */}
      <div className='grid grid-cols-2 gap-6 mb-8'>
        <div>
          <h2 className='text-xl font-bold mb-4'>Do you have any health conditions?</h2>
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <button
              onClick={() => setHasHealthCondition(true)}
              className={`p-3 border border-gray-300 rounded-md relative ${
                hasHealthCondition ? 'border-purple-900' : ''
              }`}
            >
              {hasHealthCondition && (
                <div className='absolute top-2 left-2 w-5 h-5 bg-purple-900 rounded-full flex items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
              Yes
            </button>
            <button
              onClick={() => setHasHealthCondition(false)}
              className={`p-3 border border-gray-300 rounded-md relative ${
                hasHealthCondition === false ? 'border-purple-900' : ''
              }`}
            >
              {hasHealthCondition === false && (
                <div className='absolute top-2 left-2 w-5 h-5 bg-purple-900 rounded-full flex items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
              No
            </button>
          </div>
          
          {hasHealthCondition && (
            <div>
              <div className='flex gap-2 mb-2'>
                <input
                  type='text'
                  className='flex-1 p-2 border border-gray-300 rounded-md'
                  placeholder='Add health condition'
                  value={newHealthCondition}
                  onChange={(e) => setNewHealthCondition(e.target.value)}
                />
                <button
                  onClick={handleAddHealthCondition}
                  className='px-4 py-2 bg-purple-900 text-white rounded-md'
                >
                  Add
                </button>
              </div>
              {healthConditions.length > 0 && (
                <div className='mt-2'>
                  <p className='font-medium mb-1'>Added health conditions:</p>
                  <ul className='list-disc pl-5'>
                    {healthConditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <h2 className='text-xl font-bold mb-4'>Do you have any allergies?</h2>
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <button
              onClick={() => setHasAllergies(true)}
              className={`p-3 border border-gray-300 rounded-md relative ${
                hasAllergies ? 'border-purple-900' : ''
              }`}
            >
              {hasAllergies && (
                <div className='absolute top-2 left-2 w-5 h-5 bg-purple-900 rounded-full flex items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
              Yes
            </button>
            <button
              onClick={() => setHasAllergies(false)}
              className={`p-3 border border-gray-300 rounded-md relative ${
                hasAllergies === false ? 'border-purple-900' : ''
              }`}
            >
              {hasAllergies === false && (
                <div className='absolute top-2 left-2 w-5 h-5 bg-purple-900 rounded-full flex items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
              No
            </button>
          </div>
          
          {hasAllergies && (
            <div>
              <div className='flex gap-2 mb-2'>
                <input
                  type='text'
                  className='flex-1 p-2 border border-gray-300 rounded-md'
                  placeholder='Add allergy'
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                />
                <button
                  onClick={handleAddAllergy}
                  className='px-4 py-2 bg-purple-900 text-white rounded-md'
                >
                  Add
                </button>
              </div>
              {allergiesList.length > 0 && (
                <div className='mt-2'>
                  <p className='font-medium mb-1'>Added allergies:</p>
                  <ul className='list-disc pl-5'>
                    {allergiesList.map((allergy, index) => (
                      <li key={index}>{allergy}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <div className='flex justify-end'>
        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className={`py-3 px-8 ${isUploading ? 'bg-gray-400' : 'bg-purple-900'} text-white rounded-md`}
        >
          {isUploading ? 'Uploading...' : 'Next'}
        </button>
      </div>

      {showWeightDropdown && renderWeightDropdown()}
      {showHeightDropdown && renderHeightDropdown()}
    </div>
  );
}