import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-500 shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/user"
              className="text-3xl font-extrabold text-white hover:text-gray-200 transition duration-300"
            >
              SkillUp
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              to="/user"
              className="text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Dashboard
            </Link>
            <Link
              to="/user/interview"
              className="text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Take Interview
            </Link>
            <Link
              to="/user/jobs"
              className="text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Job Listings
            </Link>
          </div>

          {/* User Info and Logout */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user && (
              <span className="text-white text-sm">
                Welcome, {user.name}!
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-600">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/user"
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
              >
                Dashboard
              </Link>
              <Link
                to="/user/jobs"
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
              >
                Job Listings
              </Link>
              {user && (
                <div className="pt-4 pb-3 border-t border-gray-400">
                  <div className="flex items-center px-5">
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">
                        {user.name}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:bg-red-500 hover:text-gray-100 transition duration-300"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
