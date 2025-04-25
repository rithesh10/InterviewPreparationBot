import React, { useEffect, useState } from "react";
import {
  UploadCloud,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  BookmarkIcon,
  Shield,
  Scroll,
  Crown,
  Flag,
  X
} from "lucide-react";
import axios from "axios";
import config from "../../config/config";
import { useParams } from "react-router-dom";

const JobDescription = () => {
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  
  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);
  
  const fetchJob = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.backendUrl}/jobs/job/${id}`, {
        withCredentials: true
      });
      
      if (response.status === 404) {
        throw new Error('Job not found');
      }
      
      setJob(response.data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
      setMessage('Failed to fetch job details.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto my-8 flex justify-center items-center h-96 bg-gray-900 rounded-lg">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-amber-600 border-gray-700"></div>
          <p className="mt-4 text-amber-500 font-serif">The ravens are gathering information...</p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="max-w-6xl mx-auto my-8 p-8 bg-gray-900 text-red-500 flex justify-center items-center h-64 rounded-lg">
        <div className="text-center">
          <X size={48} className="mx-auto mb-4" />
          <p className="text-xl">{message}</p>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className=" mx-auto bg-black-1000">
      {/* Banner with House sigil-like design */}
      <div className="relative h-48 bg-gray-900 rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1600x400')] opacity-20 bg-center bg-cover"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Flag className="text-amber-600 w-16 h-16" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>

      <div className="bg-gray-900 border-t-4 border-amber-600 shadow-xl">
        {/* Main content area with two-column layout for desktop */}
        <div className="md:flex">
          {/* Left sidebar - Company information */}
          <div className="md:w-1/3 p-6 border-r border-gray-800">
            <div className="sticky top-6">
              <div className="mb-6 pb-6 border-b border-gray-800">
                <h2 className="text-3xl font-serif text-amber-500 mb-2">{job.title}</h2>
                <div className="flex items-center mb-3">
                  <Shield className="mr-2 text-amber-400" size={16} />
                  <span className="text-gray-300 font-medium">{job.company}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 text-amber-400" size={16} />
                  <span className="text-gray-300">{job.location}</span>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-800">
                <h3 className="text-lg font-serif text-amber-500 mb-4">The Offering</h3>
                <div className="flex items-center mb-4">
                  <Crown className="mr-3 text-amber-400" size={16} />
                  <div>
                    <span className="text-xs text-gray-400">Reward</span>
                    <p className="text-gray-300">{job.salary_range}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-3 text-amber-400" size={16} />
                  <div>
                    <span className="text-xs text-gray-400">Posted</span>
                    <p className="text-gray-300">{new Date(job.posted_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <button className="w-full bg-amber-700 hover:bg-amber-600 text-gray-100 py-3 px-4 rounded font-medium flex items-center justify-center">
                  <Scroll className="mr-2" size={18} />
                  <span>Pledge Your Service</span>
                </button>
                <button className="w-full mt-3 bg-transparent hover:bg-gray-800 text-amber-500 border border-amber-700 py-3 px-4 rounded font-medium flex items-center justify-center">
                  <BookmarkIcon className="mr-2" size={18} />
                  <span>Save to Scroll</span>
                </button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Apply before {new Date(job.application_deadline).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Right side - Main content */}
          <div className="md:w-2/3 p-6">
            {/* Description section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Scroll className="mr-2 text-amber-500" />
                <h3 className="text-xl font-serif text-amber-500">The Decree</h3>
              </div>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>{job.description}</p>
              </div>
            </div>

            {/* Skills section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Shield className="mr-2 text-amber-500" />
                <h3 className="text-xl font-serif text-amber-500">Required Talents</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.skills_required.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-800 text-amber-400 px-3 py-1 rounded text-sm border border-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Requirements section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Crown className="mr-2 text-amber-500" />
                <h3 className="text-xl font-serif text-amber-500">Oath of Service</h3>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <ul className="space-y-4 text-gray-300">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="mr-3 mt-1 text-amber-500 flex-shrink-0" size={18} />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* House words - Footer */}
            <div className="border-t border-gray-800 pt-6 mt-8">
              <blockquote className="italic text-gray-400 text-center font-serif">
                "A Lannister always pays his debts"
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;