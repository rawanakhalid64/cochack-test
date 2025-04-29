'use client'
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import instance from "../../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const EmailVerification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle OTP submission
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email, "OTP:", otp); 
    try {
      const response = await instance.post("/api/v1/auth/verify-password-otp", {
        email,
        otp,
      });
  
      if (response.status === 200 || response.status === 201) {
        toast.success("OTP verified successfully.");
        router.push("/verification-success");
      } else if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred during OTP verification.";
      console.error("Error during OTP verification:", error); 
      toast.error(errorMessage);
    }
  };
  
  // Handle OTP resend
  const handleResend = async () => {
    setIsResending(true);
    setMessage("");
    console.log("Attempting to resend OTP to:", email); 
    try {
      const response = await instance.post("/api/v1/auth/send-otp", { email });
      console.log("OTP resend response:", response); 

      if (response.status === 200 || response.status === 201) {
        setMessage("A new OTP has been sent to your email.");
        toast.success("A new OTP has been sent to your email.");
      } else {
        setMessage(response.data.error || "Failed to resend OTP.");
        toast.error(response.data.error || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error); 
      setMessage("An error occurred while resending the OTP.");
      toast.error("An error occurred while resending the OTP.");
    } finally {
      setIsResending(false);
    }
  };
  return (
    <div className="flex flex-col items-center bg-white min-h-screen p-4 md:p-8">
        <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-xl md:text-2xl font-bold mt-3 text-center">Email Confirmation</h1>
      <Image 
        src="https://res.cloudinary.com/dvgqyejfc/image/upload/v1730836823/Mail_sent-amico_1_nqhdlc.webp" 
        alt="Email Confirmation" 
        width={300} // Adjusted for smaller screens
        height={300}
        className="md:w-[500px] md:h-[500px] object-contain"
      />
      <p className="text-center mt-4 text-sm md:text-base">
        Please check your email {email} and type below the confirmation code you received
      </p>
      <form onSubmit={handleOtpSubmit} className="flex flex-col items-center space-y-4 mt-4 w-full md:w-1/2">
        <input
          type="text"
          name="otp"
          value={otp}
          onChange={handleOtpChange}
          className="w-full border-b border-gray-400 p-2 text-center placeholder-gray-500"
          placeholder="Code"
          required
        />
        <button
          type="submit"
          className="w-full  bg-[#2E0D44] md:w-[325px] py-2 mt-6 font-semibold text-white rounded-md "
          // style={{
          //   background: 'linear-gradient(277.62deg, #E5958E 30.69%, #220440 110.35%)'
          // }}
        >
          Continue
        </button>
        <button
        onClick={handleResend}
        disabled={isResending}
        className={`btn ${isResending ? "opacity-50 " : "w-full  bg-[#9a54c8] md:w-[325px] py-2 mt-6 font-semibold text-white rounded-md "}`}
      >
        {isResending ? "Resending..." : "Resend OTP"}
      </button>
        {/* {message && ( */}
          {/* // <p className={`mt-2 text-center ${message === "OTP verified successfully." ? 'text-green-600' : 'text-red-600'}`}>
          //   {message}
          // </p> */}
        {/* )} */}
      </form>
    </div>
  );
};

export default EmailVerification;
