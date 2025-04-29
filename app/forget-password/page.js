

"use client";
import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/v1/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage("OTP sent to your email!");
        setIsOTPSent(true); // Indicate that OTP has been sent successfully
      } else {
        setMessage(result.error || "Failed to send OTP.");
      }
    } catch (error) {
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFBFBB]">
      <div className="bg-[#EFBFBB] p-8 w-full max-w-md md:flex md:max-w-4xl">
        <div className="md:w-1/2 p-8">
          <Image
            src="https://res.cloudinary.com/dvgqyejfc/image/upload/v1730749014/Forgot_password-rafiki_1_vcnzbs.webp"
            alt="Forget Password"
            width={500}
            height={500}
            className="mx-auto"
          />
        </div>
        <div className="md:w-1/2 p-8 mt-12">
          <h2 className="text-2xl font-bold text-white mb-2">
            Forget Password
          </h2>
          <p className="text-white mb-6">
            Please enter your email address to receive a verification code.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="relative w-full mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full border-b border-black bg-[#EFBFBB] text-white py-2 placeholder-transparent focus:outline-none focus:border-purple-600"
                required                 
              />
              <label className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
                {email ? '' : 'Email Address'}
              </label>
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#2E0D44] text-white font-semibold rounded-lg hover:bg-purple-800"
            >
              Continue
            </button>
          </form>
          {message && <p className="mt-4 text-pink-600">{message}</p>}
          {isOTPSent && (
            <Link
              href={{
                pathname: "/CodeVerification",
                query: { email },
              }}
              className="block mt-4 w-full py-3 bg-purple-800 text-white font-semibold rounded-lg text-center hover:bg-purple-900"
            >
              Go to Code Verification
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
