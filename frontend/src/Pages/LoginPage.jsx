import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import config from '../config/config';
import {useNavigate} from 'react-router-dom'

const LoginPage = () => {
  const {login,user} =useAuth()
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message,setMessage]=useState("")
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing again
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } 

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
  
    setIsLoading(true);
    setMessage(""); // Clear previous messages
  
    try {
      const response = await axios.post(`${config.backendUrl}/users/login`, formData, {
        withCredentials: true
      });
  
      if (response.status === 200) {
        const user = response.data.user;
        login(user);
        console.log(user);
  
        // Redirect based on role
        if (user?.role === "user") {
          navigate("/user");
        } else if (user?.role === "admin") {
          navigate("/admin");
        } else {
          console.error("Unknown role:", user.role);
          setMessage("Unexpected role assigned.");
        }
      }
    } catch (error) {
      setIsLoading(false);
  
      if (error.response) {
        const { status, data } = error.response;
  
        if (status === 400 && data.error === "Invalid credentials") {
          setMessage("Invalid email or password.");
        } else if (status === 400 && data.error.includes("Missing fields")) {
          setMessage("Please fill in all required fields.");
        } else if (status === 500 && data.error === "Token generation failed") {
          setMessage("Login failed due to a server error. Please try again.");
        } else {
          setMessage(data.error || "An unexpected error occurred.");
        }
      } else {
        setMessage("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex w-screen min-h-screen items-center justify-center bg-gray-900 px-4 py-12 sm:px-6 lg:px-8 bg-[url('/img/castle-bg.jpg')] bg-cover bg-center">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 shadow-md rounded-lg border border-gray-700">
        <div>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-200">
            Pledge Your Allegiance
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <a href="/register" className="font-medium text-red-600 hover:text-red-500">
              begin your allegianece by combat
            </a>
          </p>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Raven Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.email ? 'border-red-700' : 'border-gray-600'
                } rounded-lg focus:outline-none text-gray-200 bg-gray-700 focus:ring-red-500 focus:border-red-500`}
                placeholder="Enter your raven address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                House Words
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.password ? 'border-red-700' : 'border-gray-600'
                } rounded-lg focus:outline-none text-gray-200 bg-gray-700 focus:ring-red-500 focus:border-red-500`}
                placeholder="Enter your house words"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-red-600 border-gray-600 rounded focus:ring-red-500 bg-gray-700"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
                Remember my oath
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-yellow-500 hover:text-yellow-400">
                Forgot your house words?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-red-800 rounded-lg text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 disabled:bg-red-900"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                'Swear Fealty'
              )}
            </button>
          </div>
        </form>
        <div className="text-center text-red-500">{message}</div>
      </div>
    </div>
  );
};

export default LoginPage;