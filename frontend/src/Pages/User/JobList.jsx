import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config/config";
import { Briefcase, MapPin } from "lucide-react";
import JobDetails from "./JobDetails";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/jobs/jobs`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  if (selectedJob) {
    return <JobDetails job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
          Job Opportunities
        </h1>

        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-blue-800">
                    {job.title}
                  </h2>
                  <div className="flex items-center text-gray-600 mt-2 space-x-6">
                    <div className="flex items-center">
                      <Briefcase className="mr-2 text-blue-500" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 text-blue-500" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out"
                  onClick={() => setSelectedJob(job)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobList;
