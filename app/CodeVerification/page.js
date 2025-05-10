// 'use client';

// import { useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import Image from "next/image";

// export default function CodeVerification() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const email = searchParams.get("email");
//   const [otp, setOtp] = useState('');
//   const [message, setMessage] = useState('');
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:3001/api/v1/auth/verify-password-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         setMessage("OTP verified successfully.");
//         router.push(`/NewPassword?email=${email}`);
//       } else {
//         setMessage(result.error || "OTP verification failed.");
//       }
//     } catch (error) {
//       setMessage("An error occurred.");
//     }
//   };
  

//   return (
//     <div className=" min-h-screen flex flex-col items-center justify-center bg-[#EFBFBB]">
//       <div className="bg-[#EFBFBB] p-8 w-full max-w-md md:flex md:max-w-4xl">
//       <div className="md:w-1/2 p-8">
//       <h2 className="text-xl font-bold text-white mb-2">Code Verification</h2>
//       <p className="text-white mb-6">Please enter the 6-digit code sent to {email}.</p>
//       <form onSubmit={handleSubmit} className="w-full max-w-md px-4">
//         <div className="relative w-full mb-6">
//           <input
//             type="text"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             placeholder="Type Here"
//             className="w-full border-b border-black bg-[#EFBFBB] text-white py-2 placeholder-transparent focus:outline-none focus:border-[#2E0D44]"
//             required
//           />
//           <label className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white pointer-events-none transition-all duration-200 ease-in-out">
//             {otp ? '' : 'Type Here'}
//           </label>
//         </div>
//         <button type="submit" className="w-full py-3 bg-[#2E0D44] text-white font-semibold rounded-lg hover:bg-purple-800">
//           Continue
//         </button>
//       </form>
//       {message && <p className="mt-4 text-pink-600">{message}</p>}
//     </div>
//     <div className="hidden md:block md:w-1/2 p-8">

//     <Image
//             src="https://res.cloudinary.com/dvgqyejfc/image/upload/v1730749014/Forgot_password-rafiki_1_vcnzbs.webp"
//             alt="Forget Password"
//             width={500}
//             height={500}
//             className="mx-auto"
//           />
//     </div>
//     </div>
//     </div>


//   );
// }
'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from "next/image";
import instance from "../../utils/axios";

export default function CodeVerification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  // Handle OTP verification submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.post("/api/v1/auth/verify-password-otp", {
        email,
        otp,
      });
  
      if (response.status === 200 || response.status === 201) {
        setMessage("OTP verified successfully.");
        router.push(`/NewPassword?email=${email}`);
      } else {
        setMessage(response.data.error || "OTP verification failed.");
      }
    } catch (error) {
      setMessage("An error occurred.");
      console.error("Error verifying OTP:", error);
    }
  };
  

  // Handle OTP resend
  const handleResend = async () => {
    setIsResending(true);
    setMessage('');
    console.log("Attempting to resend OTP to:", email); // Log the email value
    try {
      const response = await instance.post("/api/v1/auth/send-otp", { email });
      console.log("OTP resend response:", response); // Log the response
  
      if (response.status === 200 || response.status === 201) {
        setMessage("A new OTP has been sent to your email.");
      } else {
        setMessage(response.data.error || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error); // Log the error
      setMessage("An error occurred while resending the OTP.");
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFBFBB]">
      <div className="bg-[#EFBFBB] p-8 w-full max-w-md md:flex md:max-w-4xl">
        <div className="md:w-1/2 p-8">
          <h2 className="text-xl font-bold text-white mb-2">Code Verification</h2>
          <p className="text-white mb-6">Please enter the 6-digit code sent to {email}.</p>
          <form onSubmit={handleSubmit} className="w-full max-w-md px-4">
            <div className="relative w-full mb-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Type Here"
                className="w-full border-b border-black bg-[#EFBFBB] text-white py-2 placeholder-transparent focus:outline-none focus:border-[#2E0D44]"
                required
              />
              <label className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white pointer-events-none transition-all duration-200 ease-in-out">
                {otp ? '' : 'Type Here'}
              </label>
            </div>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className={`w-full font-normal text-base leading-6 py-3 mt-4 text-[16px] ${
                isResending
                  ? 'bg-[#EFBFBB] text-gray-400 cursor-not-allowed'
                  : 'bg-[#EFBFBB] text-black underline'
              }`}
            >
              {isResending ? 'Resending...' : 'Resend Code'}
            </button>
            <button
              type="submit"
              className="w-[293px] py-3 bg-[#2E0D44] text-white font-semibold rounded-lg hover:bg-purple-800"
            >
              Continue
            </button>
          </form>

          {message && <p className="mt-4 text-center text-pink-600">{message}</p>}
        </div>
        <div className="hidden md:block md:w-1/2 p-8">
          <Image
            src="https://res.cloudinary.com/dvgqyejfc/image/upload/v1730749014/Forgot_password-rafiki_1_vcnzbs.webp"
            alt="Forget Password"
            width={500}
            height={500}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
