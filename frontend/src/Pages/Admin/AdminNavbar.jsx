import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">
          Admin Panel
        </h1>
        <ul className="flex space-x-8 md:space-x-12">
          <li>
            <Link to="/admin" className="text-white hover:text-blue-500 transition duration-300 ease-in-out">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="text-white hover:text-blue-500 transition duration-300 ease-in-out">
              Users
            </Link>
          </li>
          <li>
            <Link to="/admin/jobs" className="text-white hover:text-blue-500 transition duration-300 ease-in-out">
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/admin/settings" className="text-white hover:text-blue-500 transition duration-300 ease-in-out">
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
