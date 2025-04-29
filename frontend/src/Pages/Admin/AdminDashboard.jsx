import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config/config";
import { Briefcase } from 'lucide-react';
import JobList from "./JobList";
import JobForm from "./JobForm";
import ResumeList from "./ResumeList";
import ErrorAlert from "./ErrorAlert";
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [JobId, setJobId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.backendUrl}/jobs/jobs`, { withCredentials: true });
      setJobs(response.data.jobs || []);
      setError(null);
    } catch (error) {
      setError("Failed to fetch job listings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResumes = async (jobId) => {
    setIsLoading(true);
    try {
      setJobId(jobId)
      const response = await axios.get(`${config.backendUrl}/resume/get-resume-jobId/${jobId}`, { withCredentials: true });
      setResumes(response.data.resumes || []);
      setError(null);
    } catch (error) {
      setError("Failed to fetch resumes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-blue-800 mb-8 flex items-center space-x-4">
          <Briefcase className="text-blue-600 w-8 h-8" />
          <span>Admin Dashboard</span>
        </h2>

        {error && <ErrorAlert message={error} />}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <JobList 
              jobs={jobs} 
              fetchResumes={fetchResumes} 
              setSelectedJob={setSelectedJob} 
              fetchJobs={fetchJobs} 
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <JobForm fetchJobs={fetchJobs} setError={setError} />
          </div>
        </div>

        {selectedJob && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <ResumeList resumes={resumes} jobTitle={selectedJob.title} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
