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
    setMessage("");
  
    try {
      const response = await axios.post(`${config.backendUrl}/users/login`, formData, {
        withCredentials: true
      });
  
      if (response.status === 200) {
        const user = response.data.user;
        login(user);
        console.log(user);
  
        if (user?.role === "user") {
          navigate("/user", { state: { userId: user._id } });
        } else if (user?.role === "admin") {
          navigate("/admin", { state: { userId: user._id } });
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
    <div className="flex w-screen   min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-md rounded-lg">
        <div>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              start your 14-day free trial
            </a>
          </p>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none text-black focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none text-black focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your password"
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
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
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
                'Sign in'
              )}
            </button>
          </div>
        </form>
        {message}
      </div>
    </div>
  );
};

export default LoginPage;
