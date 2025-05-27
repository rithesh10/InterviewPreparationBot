import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  User,
  Bell,
  Briefcase,
  FileText,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Upload,
  TrendingUp,
  Award,
  PieChart,
  Compass,
  Target,
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [jobApplications, setJobApplications] = useState(mockJobApplications);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [recommendedJobs, setRecommendedJobs] = useState(mockRecommendedJobs);

  const [resumeName, setResumeName] = useState('');
  const [activeSection, setActiveSection] = useState('home');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied': return <Clock className="text-yellow-500" />;
      case 'Interview': return <CheckCircle className="text-green-500" />;
      case 'Rejected': return <XCircle className="text-red-500" />;
      default: return null;
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setResumeName(e.target.files[0].name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              <span className="block">Discover Your</span>
              <span className="block text-indigo-600">Professional Potential</span>
            </h1>
            <p className="text-xl text-gray-600">
              Our AI-powered assessment platform helps you understand where you stand in the job market and what steps to take next in your career journey.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/user/three-steps" className="flex items-center">  
                <button className="px-8 py-4 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center">
                  Get Started <ArrowRight className="ml-2" size={18} />
                </button>
              </Link>
              <button className="px-8 py-4 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                Learn More
              </button>
            </div>
          </div>
          <div className="hidden lg:block relative h-96">
            <div className="absolute inset-0 bg-indigo-100 rounded-xl overflow-hidden">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500 rounded-full opacity-20"></div>
              <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-blue-400 rounded-full opacity-20"></div>
              <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-purple-400 rounded-full opacity-20"></div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl w-64">
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="text-center text-gray-800 font-medium">Career Readiness: 75%</div>
              </div>

              <div className="absolute top-1/4 right-1/3 bg-white p-4 rounded-lg shadow-lg">
                <Award className="text-indigo-500" size={24} />
                <span className="text-sm font-medium">Top 10% skills</span>
              </div>

              <div className="absolute bottom-1/4 left-1/3 bg-white p-4 rounded-lg shadow-lg">
                <TrendingUp className="text-green-500" size={24} />
                <span className="text-sm font-medium">Growing fast</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Get to Know Yourself Better
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive assessment tools provide personalized insights to help you make informed career decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <PieChart className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Skill Analysis</h3>
              <p className="text-gray-600">
                Discover your strengths and areas for improvement with our detailed skill assessment reports.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Compass className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Career Path Mapping</h3>
              <p className="text-gray-600">
                Explore potential career paths based on your unique profile and market demands.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Target className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Goals</h3>
              <p className="text-gray-600">
                Set achievable milestones and track your progress with customized development plans.
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Our simple four-step process helps you understand where you stand and how to improve.
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-indigo-200 transform -translate-y-1/2"></div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="relative">
                <div className="lg:absolute lg:top-0 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mb-4 lg:mb-0">
                  1
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Resume</h3>
                  <p className="text-gray-600">Submit your resume for our AI to analyze your background and skills.</p>
                </div>
              </div>

              <div className="relative">
                <div className="lg:absolute lg:top-0 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mb-4 lg:mb-0">
                  2
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Assessment</h3>
                  <p className="text-gray-600">Take our targeted assessment designed to evaluate your job-specific skills.</p>
                </div>
              </div>

              <div className="relative">
                <div className="lg:absolute lg:top-0 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mb-4 lg:mb-0">
                  3
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Receive Report Card</h3>
                  <p className="text-gray-600">Get comprehensive insights into your strengths and areas for growth.</p>
                </div>
              </div>

              <div className="relative">
                <div className="lg:absolute lg:top-0 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mb-4 lg:mb-0">
                  4
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Take Action</h3>
                  <p className="text-gray-600">Follow our personalized recommendations to boost your career prospects.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto">
              Discover how our platform has helped students and professionals alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Computer Science Student</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The assessment highlighted skills I didn't even know I had! It helped me focus my job search and land an internship at my dream tech company."
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Michael Chen</h4>
                  <p className="text-sm text-gray-600">Business Graduate</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The career path mapping was eye-opening. I discovered alternatives I hadn't considered that better matched my strengths and interests."
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Priya Patel</h4>
                  <p className="text-sm text-gray-600">Engineering Professional</p>
                </div>
              </div>
              <p className="text-gray-700">
                "After 5 years in my field, I was feeling stuck. This platform helped me identify skill gaps and create a development plan that led to a promotion."
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
            Ready to Discover Your Potential?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of students and professionals who have transformed their careers with our assessment platform.
          </p>
          <div className="inline-flex rounded-md shadow">
          <Link to="/user/three-steps" className="flex items-center">
            <button className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Get Started For Free
            </button>
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CareerCompass</h3>
              <p className="text-gray-400">
                Guiding your professional journey with data-driven insights.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CareerCompass. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;