import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to Application Tracking System</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        The smartest platform to manage your work and boost productivity.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
      >
        Login
      </button>
    </div>
  );
};

export default LandingPage;
