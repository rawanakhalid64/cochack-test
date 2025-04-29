"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const VerificationSuccess = () => {
  const router = useRouter();
  const userData = useSelector((state) => state.user.userData); 
console.log(userData)
useEffect(() => {
  console.log("User Data:", userData);
}, [userData]);

  const handleContinue = () => {
  
    if (userData) {
     
      if (userData.user.role === "trainer") {
        router.push("/TrainerDataCreation");
      } else if (userData.user.role === "client") {
        router.push("/traineeData");
      } else {
        router.push("/"); 
      }
    } else {
      router.push("/"); 
    }
  };


  return (
    <div className="flex flex-col items-center bg-[#2E0D44] min-h-screen p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl text-white font-bold mt-3 text-center">Congratulations</h1>
      <Image
        src="https://res.cloudinary.com/dvgqyejfc/image/upload/v1731188512/Verified-bro_1_1_n2bjyp.webp"
        alt="Email Verified"
        width={300} 
        height={300}
        className="md:w-[500px] md:h-[500px] object-contain"
      />
      <p className="text-center text-white mt-4 text-sm md:text-base">
      Welcome, {userData?.user?.firstName} {userData?.user?.lastName}! Your account has been verified successfully. <br className="hidden md:block" /> continue to go to the
        home page.
      </p>
      <button
        type="button" // Use "button" type for non-form buttons
        className="w-full md:w-[325px] py-2 mt-6 font-semibold text-white rounded-md"
        style={{
          background: "linear-gradient(277.62deg, #E5958E 30.69%, #220440 110.35%)",
        }}
        onClick={handleContinue} // Attach the defined function
      >
        Continue
      </button>
    </div>
  );
};

export default VerificationSuccess;
