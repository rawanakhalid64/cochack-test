"use client";
import React from "react";
import SidebarLayout from "../../components/SidebarLayout/SidebarLayout";
import { useSelector } from "react-redux";

export default function Statistics() {
  const userData = useSelector(state => state.user.userData);
  const isLoading = useSelector(state => state.user.isLoading);
  
  if (isLoading) return <SidebarLayout><div>Loading...</div></SidebarLayout>;
  
  return (
    <SidebarLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Statistics</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-200 rounded-md px-10 py-2 w-64"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-2.5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
      </div>
      
      {/* Statistics content */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4">Your Fitness Progress</h2>
        <p className="text-gray-600 mb-6">
          This page will show your workout and fitness statistics. Currently in development.
        </p>
        
        {userData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Workouts</h3>
              <p className="text-3xl font-bold mt-2 text-blue-600">
                {userData.workouts?.total || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total sessions</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Calories</h3>
              <p className="text-3xl font-bold mt-2 text-green-600">
                {userData.calories?.burned || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Burned this month</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Time</h3>
              <p className="text-3xl font-bold mt-2 text-purple-600">
                {userData.workouts?.totalHours || 0}h
              </p>
              <p className="text-sm text-gray-500 mt-1">Workout duration</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Streak</h3>
              <p className="text-3xl font-bold mt-2 text-yellow-600">
                {userData.streak?.current || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Days in a row</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Activity Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4">Activity Timeline</h2>
        
        {userData?.activities ? (
          <div className="space-y-4">
            {userData.activities.map((activity, index) => (
              <div key={index} className="flex items-start border-l-2 border-blue-500 pl-4">
                <div className="mr-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    {activity.type === 'cardio' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M12 3c-.53 0-1.04.21-1.41.59L8 6.59l-2.59-2.59a2 2 0 00-2.82 0 2 2 0 000 2.82L6.41 8 3.59 10.82a2 2 0 000 2.82 2 2 0 002.82 0L8 11.41l2.59 2.59a2 2 0 002.82 0 2 2 0 000-2.82L10.59 8l2.82-2.82a2 2 0 00-2.82-2.82z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{activity.name}</h3>
                  <p className="text-sm text-gray-600">{activity.date}</p>
                  <div className="mt-2 flex space-x-4">
                    <span className="text-sm text-gray-500">
                      <span className="font-medium">{activity.duration}</span> min
                    </span>
                    <span className="text-sm text-gray-500">
                      <span className="font-medium">{activity.calories}</span> kcal
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No activity data available yet.</p>
        )}
      </div>
      
      {/* Goals Progress */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Goals Progress</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Add New Goal
          </button>
        </div>
        
        {userData?.goals ? (
          <div className="space-y-6">
            {userData.goals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{goal.name}</h3>
                  <span className="text-sm text-gray-500">{goal.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  {goal.current} of {goal.target} {goal.unit}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No goals set yet. Add a goal to track your progress!</p>
        )}
      </div>
    </SidebarLayout>
  );
}