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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-yellow-500 mb-8">
          Ravens from the Citadel
        </h1>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-gray-800 border border-gray-700 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-yellow-400">
                    {job.title}
                  </h2>
                  <div className="flex items-center text-gray-400 mt-2 space-x-4">
                    <div className="flex items-center">
                      <Briefcase className="mr-2 text-red-700" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 text-red-700" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="bg-red-800 text-gray-200 px-6 py-2 rounded-lg hover:bg-red-900 transition-colors border border-red-700"
                  onClick={() => setSelectedJob(job)}
                >
                  View Scroll
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