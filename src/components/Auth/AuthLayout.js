// src/components/Auth/AuthLayout.js
import React from 'react';
import { Bell } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-blue-50 to-white">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="bg-[#00a6d6] text-white p-3 rounded-xl inline-block mb-4 shadow-sm">
          <Bell size={32} fill="currentColor" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Medication Reminder & Tracker</h1>
        <p className="text-gray-500 text-lg">Never miss a dose again</p>
      </div>

      {/* Auth Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md border border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-500 mt-2">{subtitle}</p>
        </div>
        
        {children}
      </div>

      {/* Medical Disclaimer */}
      <p className="text-gray-300 text-xs text-center mt-12 max-w-xs">
        This app does not provide medical advice, diagnosis, or treatment. Always consult your healthcare provider.
      </p>
    </div>
  );
};

export default AuthLayout;