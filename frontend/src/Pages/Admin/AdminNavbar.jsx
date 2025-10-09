import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Briefcase, Users, Settings, LayoutDashboard, LogOut } from "lucide-react";

const AdminNavbar = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: "/admin/users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { to: "/admin/jobs", label: "Jobs", icon: <Briefcase className="w-4 h-4" /> },
    { to: "/admin/settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Title */}
        <h1 className="text-2xl font-bold tracking-wide">
          ATS Admin
        </h1>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isActive(link.to)
                    ? "bg-white text-blue-700 shadow-md"
                    : "hover:bg-blue-600 hover:text-white"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout Button (Placeholder) */}
        <button
          onClick={() => {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
          }}
          className="bg-white text-blue-700 px-3 py-2 rounded-md font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile Menu (Optional Expansion Later) */}
      <div className="md:hidden mt-3 flex justify-around text-sm">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex flex-col items-center ${
              isActive(link.to)
                ? "text-yellow-300"
                : "hover:text-gray-200"
            }`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default AdminNavbar;
