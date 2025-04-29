import React from "react";
import { AlertTriangle } from "lucide-react";

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-600 text-red-800 px-6 py-4 rounded-lg shadow-lg flex items-center mb-4 transition-all ease-in-out duration-300 transform hover:scale-105">
      <AlertTriangle className="mr-3 text-red-600 w-6 h-6" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default ErrorAlert;