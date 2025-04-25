import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <ul className="flex space-x-6">
          <li>
            <Link to="/admin" className="hover:text-gray-400">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="hover:text-gray-400">
              Users
            </Link>
          </li>
          <li>
            <Link to="/admin/jobs" className="hover:text-gray-400">
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/admin/settings" className="hover:text-gray-400">
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
