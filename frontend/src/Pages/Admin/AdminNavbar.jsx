import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react"; // Fantasy-inspired icon

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-500 flex items-center space-x-2">
          <Shield className="w-6 h-6 text-yellow-500" />
          <span>Council of the Realm</span>
        </h1>
        <ul className="flex space-x-8">
          <li>
            <Link
              to="/admin"
              className="hover:text-red-400 font-semibold text-lg transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="hover:text-red-400 font-semibold text-lg transition-colors"
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              to="/admin/jobs"
              className="hover:text-red-400 font-semibold text-lg transition-colors"
            >
              Jobs
            </Link>
          </li>
          <li>
            <Link
              to="/admin/settings"
              className="hover:text-red-400 font-semibold text-lg transition-colors"
            >
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
