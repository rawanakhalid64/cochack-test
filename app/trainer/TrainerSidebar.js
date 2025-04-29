// app/trainer/TrainerSidebar.js
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaBell, FaLock, FaCertificate, FaMoneyBillWave } from "react-icons/fa";

export default function TrainerSidebar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-md p-4">
      <div className="flex flex-col space-y-6 mt-8">
        <Link
          href="/trainer/profile/TrainerProfileUpdated"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive("/trainer/profile/TrainerProfileUpdated") ? "bg-red-100 text-red-600" : "hover:bg-gray-100"}`}
        >
          <FaUser className="text-lg" />
          <span>Profile</span>
        </Link>

        <Link
          href="/trainer/subscriptions"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive("/trainer/subscriptions") ? "bg-red-100 text-red-600" : "hover:bg-gray-100"}`}
        >
          <FaMoneyBillWave className="text-lg" />
          <span>Subscriptions</span>
        </Link>

        <Link
          href="/trainer/reminders"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive("/trainer/reminders") ? "bg-red-100 text-red-600" : "hover:bg-gray-100"}`}
        >
          <FaBell className="text-lg" />
          <span>Reminders</span>
        </Link>

        <Link
          href="/trainer/certificates"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive("/trainer/certificates") ? "bg-red-100 text-red-600" : "hover:bg-gray-100"}`}
        >
          <FaCertificate className="text-lg" />
          <span>Certificates</span>
        </Link>

        <Link
          href="/trainer/password"
          className={`flex items-center space-x-3 p-3 rounded-lg ${isActive("/trainer/password") ? "bg-red-100 text-red-600" : "hover:bg-gray-100"}`}
        >
          <FaLock className="text-lg" />
          <span>Password</span>
        </Link>
      </div>
    </div>
  );
}