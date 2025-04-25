import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // console.log(user)

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 border-b border-yellow-800 shadow-md w-screen relative">
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-900 via-yellow-600 to-yellow-900"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/user"
              className="text-2xl font-bold text-yellow-600 hover:text-yellow-500 font-serif tracking-wider"
            >
              REALM PORTAL
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-yellow-600 focus:outline-none focus:text-yellow-600"
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
              className="text-gray-300 hover:bg-gray-800 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium border-b border-transparent hover:border-yellow-700"
            >
            Home
            </Link>
            <Link
              to="/user/upload-resume"
              className="text-gray-300 hover:bg-gray-800 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium border-b border-transparent hover:border-yellow-700"
            >
              Upload resume
            </Link>
            <Link
              to="/user/jobs"
              className="text-gray-300 hover:bg-gray-800 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium border-b border-transparent hover:border-yellow-700"
            >
              Job listings
            </Link>
          </div>

          {/* User Info and Logout */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user && (
              <span className="text-gray-300 text-sm font-serif italic">
                Hail, {user.full_name} of House Stark
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-900 text-gray-200 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 border border-red-700"
            >
              Abandon Realm
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-yellow-900">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/user"
                className="text-gray-300 hover:bg-gray-700 hover:text-yellow-500 block px-3 py-2 rounded-md text-base font-medium"
              >
                War Council
              </Link>
              <Link
                to="/user/upload-resume"
                className="text-gray-300 hover:bg-gray-700 hover:text-yellow-500 block px-3 py-2 rounded-md text-base font-medium"
              >
                Send Ravens
              </Link>
              <Link
                to="/user/jobs"
                className="text-gray-300 hover:bg-gray-700 hover:text-yellow-500 block px-3 py-2 rounded-md text-base font-medium"
              >
                Royal Decrees
              </Link>
              {user && (
                <div className="pt-4 pb-3 border-t border-gray-600">
                  <div className="flex items-center px-5">
                    <div className="ml-3">
                      <div className="text-base font-medium text-yellow-600 font-serif">
                        {user.name} of House Stark
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:bg-red-900 hover:text-gray-100 rounded-md"
                    >
                      Abandon Realm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Gold accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-900 via-yellow-600 to-yellow-900"></div>
    </nav>
  );
};

export default Navbar;