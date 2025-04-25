import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config/config";
import { Briefcase } from "lucide-react";
import JobList from "./JobList";
import JobForm from "./JobForm";
import ResumeList from "./ResumeList";
import ErrorAlert from "./ErrorAlert";

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
      const response = await axios.get(`${config.backendUrl}/jobs/jobs`, {
        withCredentials: true,
      });
      setJobs(response.data.jobs || []);
      setError(null);
    } catch (error) {
      setError("Failed to summon the job listings. Try again, Lord.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResumes = async (jobId) => {
    setIsLoading(true);
    try {
      setJobId(jobId);
      const response = await axios.get(
        `${config.backendUrl}/resume/get-resume-jobId/${jobId}`,
        { withCredentials: true }
      );
      setResumes(response.data.resumes || []);
      setError(null);
    } catch (error) {
      setError("Could not retrieve the scrolls of allegiance. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-[url('/img/castle-bg.jpg')] bg-cover bg-center p-6">
      <div className="container mx-auto max-w-6xl bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-red-500 mb-6 flex items-center justify-center">
          <Briefcase className="w-6 h-6 mr-2 text-yellow-500" />
          Council of Employment Scrolls
        </h2>

        {error && (
          <div className="text-center text-red-400 mb-4">{error}</div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <JobList
            jobs={jobs}
            fetchResumes={fetchResumes}
            setSelectedJob={setSelectedJob}
            fetchJobs={fetchJobs}
          />
          <JobForm fetchJobs={fetchJobs} setError={setError} />
        </div>

        {/* Future resume list view */}
        {/* {selectedJob && (
          <ResumeList
            resumes={resumes}
            jobTitle={selectedJob.title}
            isLoading={isLoading}
          />
        )} */}
      </div>
    </div>
  );
};

export default AdminDashboard;
