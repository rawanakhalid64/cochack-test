'use client'
import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#2E0D44]">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="bg-white rounded-md h-8 w-8"></div>
        <span className="text-white text-xl font-bold">Coachak</span>
      </div>

      {/* Hamburger Menu Icon for Small Screens */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      <div
        className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } flex-col items-center text-center space-y-4 p-4 absolute top-16 left-0 right-0 bg-purple-700 text-white rounded-lg shadow-lg z-10 sm:hidden transition-all duration-300 ease-in-out`}
      >
        <Link href="/" onClick={() => setIsMenuOpen(false)}>
          <span className="block hover:bg-purple-600 py-2 px-4 rounded-md transition-colors">Home</span>
        </Link>
        <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>
          <span className="block hover:bg-purple-600 py-2 px-4 rounded-md transition-colors">Pricing</span>
        </Link>
        <Link href="/schedule" onClick={() => setIsMenuOpen(false)}>
          <span className="block hover:bg-purple-600 py-2 px-4 rounded-md transition-colors">Schedule</span>
        </Link>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-4 md:mt-0">
          <Link href="/login">
            <span className="px-4 py-2 text-sm font-semibold text-white bg-[#E5958E] rounded-md hover:bg-[#E5958E] transition-colors">
              Login
            </span>
          </Link>
          <Link href="/signup">
            <span className="px-4 py-2 text-sm font-semibold text-white bg-[#B46B6B] rounded-md hover:bg-[#b87d7d] transition-colors">
              Sign Up
            </span>
          </Link>
        </div>
      </div>

      {/* Navigation Links for Larger Screens */}
      <div className="hidden sm:flex space-x-6 text-white text-sm">
        <Link href="/" className="hover:underline hover:underline-offset-4">Home</Link>
        <Link href="/pricing" className="hover:underline hover:underline-offset-4">Pricing</Link>
        <Link href="/schedule" className="hover:underline hover:underline-offset-4">Schedule</Link>
      </div>

      {/* Buttons for Larger Screens */}
      <div className="hidden sm:flex space-x-4 ">
        <Link href="/login" className="px-4 py-2 text-sm font-semibold text-white bg-[#E5958E] rounded-md hover:bg-[#E5958E] transition-colors">
          Login
        </Link>
        <Link href="/signup" className="px-4 py-2 text-sm font-semibold text-white bg-[#B46B6B] rounded-md hover:bg-[#b87d7d] transition-colors">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
