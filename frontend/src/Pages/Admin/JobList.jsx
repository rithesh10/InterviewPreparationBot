import React from "react";
import { FileText, Trash2 } from "lucide-react";
import axios from "axios";
import config from "../../config/config";
import { Link } from "react-router-dom";

const JobList = ({ jobs, fetchResumes, setSelectedJob, fetchJobs }) => {
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`${config.backendUrl}/jobs/jobs/${jobId}`, { withCredentials: true });
      fetchJobs();
      alert("Job deleted successfully!");
    } catch (error) {
      alert("Failed to delete job. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 max-w-4xl mx-auto mt-10">
      <h3 className="text-3xl font-semibold mb-6 flex items-center text-gray-800">
        <FileText className="mr-3 text-blue-600" size={24} /> Job Listings
      </h3>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet.</p>
      ) : (
        <ul className="space-y-6">
          {jobs.map((job) => (
            <li
              key={job._id}
              className="bg-blue-50 rounded-lg p-5 flex justify-between items-center transition-transform transform hover:scale-105 hover:shadow-md"
            >
              <Link to={`/admin/job/${job._id}`} className="flex-1">
                <h4 className="font-semibold text-xl text-blue-800">{job.title}</h4>
                <p className="text-gray-700">{job.company}</p>
              </Link>
              <div className="flex space-x-4 items-center">
                <Link to={`/admin/resumes/${job._id}`}>
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      fetchResumes(job._id);
                    }}
                    className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  >
                    View Resumes
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="bg-red-500 text-white p-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobList;
