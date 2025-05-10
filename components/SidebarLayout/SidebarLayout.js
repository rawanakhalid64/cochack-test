"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const SidebarLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const userData = useSelector(state => state.user.userData);

  const handleNavigation = (route) => {
    router.push(route);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <div className="fixed w-64 h-screen bg-white shadow-md p-6 overflow-y-auto">
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold">Profile</span>
        </div>
        <div className="mt-8">
          <div 
            className={`p-3 ${pathname === '/traineeProfileUpdated' ? 'bg-red-300 text-white' : 'hover:bg-gray-100'} rounded flex items-center mb-4 cursor-pointer`}
            onClick={() => handleNavigation('/traineeProfileUpdated')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>Edit Profile</span>
          </div>
          <div 
            className={`p-3 ${pathname === '/Statistics' ? 'bg-red-300 text-white' : 'hover:bg-gray-100'} rounded flex items-center mb-4 cursor-pointer`}
            onClick={() => handleNavigation('/Statistics')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${pathname === '/Statistics' ? 'text-white' : 'text-blue-500'}`} viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            <span>Statistics</span>
          </div>
          <div 
            className={`p-3 ${pathname === '/subscription-plans' ? 'bg-red-300 text-white' : 'hover:bg-gray-100'} rounded flex items-center mb-4 cursor-pointer`}
            onClick={() => handleNavigation('/subscription-plans')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${pathname === '/subscription-plans' ? 'text-white' : 'text-purple-500'}`} viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
            </svg>
            <span>Subscription Plans</span>
          </div>
          <div 
            className={`p-3 ${pathname === '/reminders' ? 'bg-red-300 text-white' : 'hover:bg-gray-100'} rounded flex items-center mb-4 cursor-pointer`}
            onClick={() => handleNavigation('/reminders')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${pathname === '/reminders' ? 'text-white' : 'text-yellow-500'}`} viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span>Reminder</span>
          </div>
          <div 
            className={`p-3 ${pathname === '/nutrition-plan' ? 'bg-red-300 text-white' : 'hover:bg-gray-100'} rounded flex items-center mb-4 cursor-pointer`}
            onClick={() => handleNavigation('/nutrition-plan')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${pathname === '/nutrition-plan' ? 'text-white' : 'text-green-500'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Nutrition Plan</span>
          </div>
          <div 
            className="mt-12 p-3 flex items-center cursor-pointer hover:bg-gray-100 rounded"
            onClick={() => handleNavigation('/logout')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            <span>Logout</span>
          </div>
        </div>
      </div>
      
      {/* Main Content with left margin to accommodate fixed sidebar */}
      <div className="ml-64 flex-1 p-6">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;