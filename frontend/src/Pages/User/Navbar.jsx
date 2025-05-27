import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserCircle } from "lucide-react";

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
    <nav className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              to="/user"
              className="text-3xl font-bold text-blue-600 hover:text-blue-700 transition duration-200"
            >
              SkillUp
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:justify-center md:flex-1 md:px-8">
            <div className="flex space-x-2">
              <Link
                to="/user"
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/user/learning"
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Learning
              </Link>
              <Link
                to="/user/compiler"
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Compiler
              </Link>
              <Link
                to="/user/jobs"
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Job Listings
              </Link>
              <Link
                to="/user/interview"
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Take Interview
              </Link>
              <Link
                to="/user/performance"
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Performance
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-gray-700 text-sm font-medium">
                  {user.email.split('@')[0]} 
                </span>
                <UserCircle className="text-gray-700 w-5 h-5" />
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
            >
              Logout
            </button>
            
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
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
        </div>

        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-4 space-y-1">
            <Link
              to="/user"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              to="/user/learning"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Learning
            </Link>
            <Link
              to="/user/compiler"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Compiler
            </Link>
            <Link
              to="/user/jobs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Job Listings
            </Link>
            <Link
              to="/user/interview"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Take Interview
            </Link>
            <Link
              to="/user/performance"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Performance
            </Link>
            {user && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center px-3 py-2">
                  <UserCircle className="text-gray-700 w-6 h-6 mr-2" />
                  <span className="text-gray-700 font-medium">
                    {user.email}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;