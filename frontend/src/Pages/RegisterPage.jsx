import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: ''
  });

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
    if (!formData.fullName) newErrors.fullName = 'Name is required.';
    if (!formData.email) newErrors.email = 'Raven address is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid raven address.';
    if (!formData.password) newErrors.password = 'House words are required.';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Whispering flame (phone) is required.';
    if (!formData.gender) newErrors.gender = 'Pledge a gender.';
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
      const response = await axios.post(`${config.backendUrl}/users/register`, formData, {
        withCredentials: true
      });

      if (response.status === 201) {
        navigate('/login');
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('The White Walkers (server) are unresponsive. Try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-screen min-h-screen items-center justify-center bg-gray-900 px-4 py-12 bg-[url('/img/castle-bg.jpg')] bg-cover bg-center">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 shadow-md rounded-lg border border-gray-700">
        <div>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-200">Join the Realm</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Already sworn?{' '}
            <a href="/" className="font-medium text-red-600 hover:text-red-500">
              Reaffirm your fealty
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-2 border ${
                errors.fullName ? 'border-red-700' : 'border-gray-600'
              } rounded-lg bg-gray-700 text-gray-200 focus:ring-red-500 focus:border-red-500`}
              placeholder="Ser Jon Snow"
            />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Raven Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-2 border ${
                errors.email ? 'border-red-700' : 'border-gray-600'
              } rounded-lg bg-gray-700 text-gray-200 focus:ring-red-500 focus:border-red-500`}
              placeholder="raven@winterfell.com"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">House Words</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-2 border ${
                errors.password ? 'border-red-700' : 'border-gray-600'
              } rounded-lg bg-gray-700 text-gray-200 focus:ring-red-500 focus:border-red-500`}
              placeholder="Winter is Coming"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Whispering Flame</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-2 border ${
                errors.phoneNumber ? 'border-red-700' : 'border-gray-600'
              } rounded-lg bg-gray-700 text-gray-200 focus:ring-red-500 focus:border-red-500`}
              placeholder="1234567890"
            />
            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-2 border ${
                errors.gender ? 'border-red-700' : 'border-gray-600'
              } rounded-lg bg-gray-700 text-gray-200 focus:ring-red-500 focus:border-red-500`}
            >
              <option value="">Select your allegiance</option>
              <option value="male">Lord</option>
              <option value="female">Lady</option>
              <option value="other">Maester</option>
            </select>
            {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
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
                'Join the Watch'
              )}
            </button>
          </div>
        </form>
        <div className="text-center text-red-500">{message}</div>
      </div>
    </div>
  );
};

export default RegisterPage;
