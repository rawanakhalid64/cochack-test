


'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; 
import { FaLock } from 'react-icons/fa'; 
import Image from 'next/image';
export default function NewPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email'); // Retrieve the email from query parameters

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Validate that email is provided
    if (!email) {
      setMessage("Email is required.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: newPassword, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password changed successfully.");
        router.push('/PasswordChanged');  
      } else {
        setMessage(data.error || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 w-full max-w-md md:flex md:max-w-4xl">
        <div className="md:w-1/2 p-8">
        <Image
            src="https://res.cloudinary.com/dvgqyejfc/image/upload/v1733168131/My_password-cuate_1_cnsbgi.webp"
            alt="New Password"
            width={500} 
            height={500} 
            className="mx-auto "
          />
        </div>
        <div className="md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-4">Create New Password</h2>
          <p className="mb-6">Please enter your new password</p>
          <form onSubmit={handleSubmit}>
            {/* New Password Field */}
            <div className="relative w-full mb-6 flex items-center">
              <FaLock className="absolute left-2 text-black" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full pl-10 pr-10 border border-[#999898] rounded-lg py-2 placeholder-transparent focus:outline-none focus:border-[#2E0D44]"
                required
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-black"
              >
                {showNewPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
              </span>
              <label className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                {newPassword ? '' : 'New Password'}
              </label>
            </div>

            {/* Confirm Password Field */}
            <div className="relative w-full mb-6 flex items-center">
              <FaLock className="absolute left-2 text-black" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full pl-10 pr-10 border border-[#999898] rounded-lg py-2 placeholder-transparent focus:outline-none focus:border-[#2E0D44]"
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-black"
              >
                {showConfirmPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
              </span>
              <label className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                {confirmPassword ? '' : 'Confirm Password'}
              </label>
            </div>

            <button type="submit" className=" w-[277px] mt-[64px] mx-[33px]   py-3 bg-[#2E0D44] text-white font-semibold rounded-lg hover:bg-purple-800">
              Save
            </button>
          </form>
          {message && <p className="mt-4 text-red-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}

