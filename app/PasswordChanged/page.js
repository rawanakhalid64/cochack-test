"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PasswordChanged() {
  const router = useRouter();

  const handleContinue = () => {
    // Redirect to the login page or another page
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFBFBB] px-0 md:px-8">
      <div className="bg-[#EFBFBB] p-6 w-full max-w-md text-center md:max-w-lg">
        {/* Image Section */}
        <div className="flex justify-center mb-6">
          <Image
          src="https://res.cloudinary.com/dvgqyejfc/image/upload/v1731445468/Confirmed-bro_1_1_p7cbfu.webp"
            alt="Password Changed Successfully"
            width={600} 
            height={600} 
            className="mx-auto"
          />
        </div>
        {/* Text and Button Section */}
        <p className="text-2xl font-bold mb-4">Password Restored Successfully!</p>
        <button
          onClick={handleContinue}
          className="w-full md:w-1/2 py-3 mt-4 bg-gradient-to-r from-[#220440] to-[#E5958E] text-white font-semibold rounded-lg hover:opacity-90"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
