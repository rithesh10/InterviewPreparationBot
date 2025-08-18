import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import config from '../config/config';
import { useNavigate ,Link} from 'react-router-dom';

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
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
    setMessage('');

    try {
      const response = await axios.post(`${config.backendUrl}/users/login`, formData);

      if (response.status === 200) {
        const user = response.data.user;
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;

        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

        login(user);

        if (user?.role === 'user') {
          navigate('/user', { state: { userId: user._id } });
        } else if (user?.role === 'admin') {
          navigate('/admin', { state: { userId: user._id } });
        } else {
          setMessage('Unexpected role assigned.');
        }
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 && data.error === 'Invalid credentials') {
          setMessage('Invalid email or password.');
        } else if (status === 400 && data.error.includes('Missing fields')) {
          setMessage('Please fill in all required fields.');
        } else if (status === 500 && data.error === 'Token generation failed') {
          setMessage('Login failed due to a server error. Please try again.');
        } else {
          setMessage(data.error || 'An unexpected error occurred.');
        }
      } else {
        setMessage('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl border border-gray-100">
        {/* Branding */}
        <div className="text-center">
          <img
            src="/logo.svg"
            alt="Company Logo"
            className="w-14 h-14 mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Sign in to continue to <span className="font-semibold text-indigo-600">YourStartup</span>
          </p>
        </div>

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
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
              } rounded-lg focus:outline-none text-gray-900 focus:ring-2 focus:ring-indigo-500`}
              placeholder="you@example.com"
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
              } rounded-lg focus:outline-none text-gray-900 focus:ring-2 focus:ring-indigo-500`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Remember me
            </label>
            <a href="#" className="text-indigo-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-colors duration-200 disabled:bg-indigo-400"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="white"
                  d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 
                  5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 
                  7.94l3-2.65z"
                ></path>
              </svg>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className="mt-4 text-center text-sm text-red-600 font-medium">
            {message}
          </div>
        )}

        {/* Signup */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Start your free trial
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
