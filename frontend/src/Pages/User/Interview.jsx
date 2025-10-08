import React, { useState, useEffect } from "react";
import { Briefcase, MapPin, Calendar, User, Play, AlertCircle, Building } from "lucide-react";
import config from "../../config/config";
import axios from 'axios';
import Test from "./Test";

const Interview = ({ userId }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("No user ID provided.");
    } else {
      fetchResumes();
    }
  }, [userId]);

 const fetchResumes = async () => {
  if (!userId) {
    setError("No user ID available.");
    return;
  }

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    setError("User is not authenticated. Please login again.");
    return;
  }

  setLoading(true);
  setError("");
  setResumes([]);

  try {
    // 1️⃣ Fetch resumes along with job data in a single request
    const response = await axios.get(
      `${config.backendUrl}/resume/get-resume-with-jobs/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const resumes = response.data?.resumes || [];

    if (resumes.length > 0) {
      // No need to fetch jobs separately, they are already included
      setResumes(resumes);
    } else {
      setError("No resumes found for the given user ID.");
    }
  } catch (err) {
    console.error("Error fetching resumes with jobs:", err);
    setError("Error fetching resumes: " + err.message);
  } finally {
    setLoading(false);
  }
};

  
  const startInterview = (resumeText, jobDescription) => {
    setSelectedInterview({ resumeText, jobDescription });
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <div className="mt-6 text-center">
        <div className="text-lg font-semibold text-gray-700 mb-2">Loading your applications</div>
        <div className="text-sm text-gray-500">Fetching your latest job applications...</div>
        <div className="flex justify-center mt-3">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  if (selectedInterview) {
    return (
      <Test
        resumeText={selectedInterview.resumeText} 
        jobDescription={selectedInterview.jobDescription}
        onBack={() => setSelectedInterview(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Job Applications</h1>
          <p className="text-gray-600">Review and start interviews for your applied positions</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <div>
                <p className="font-medium text-red-800">Error occurred</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-8">
            <LoadingSpinner />
            <LoadingSkeleton />
          </div>
        )}

        {!loading && resumes.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {resumes.map((resume, index) => (
              <div
                key={resume._id}
                className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {resume.job && (
                  <>
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{resume.job.title}</h3>
                          <div className="flex items-center text-blue-100 mb-2">
                            <Building className="w-4 h-4 mr-2" />
                            <span className="font-medium">{resume.job.company}</span>
                          </div>
                          <div className="flex items-center text-blue-100">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{resume.job.location}</span>
                          </div>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                          <Briefcase className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Experience Required</span>
                          <span className="text-sm font-semibold text-gray-800">{resume.experience} years</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Employment Type</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            {resume.job.type}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Salary Range</span>
                          <span className="text-sm font-semibold text-gray-800">{resume.job.salary}</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Job Description</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {resume.job.description}
                        </p>
                      </div>

                      <button
                        onClick={() => startInterview(resume.resume_text, resume.job?.description || "")}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                      >
                        <Play className="w-5 h-5" />
                        <span>Start Interview</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && resumes.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-6">You haven't applied to any jobs yet.</p>
            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200">
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interview;