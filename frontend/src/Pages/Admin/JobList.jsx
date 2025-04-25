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
    <div className="bg-white shadow-xl rounded-xl p-6">
      <h3 className="text-2xl font-semibold mb-4 flex items-center">
        <FileText className="mr-2 text-blue-600" /> Job Listings
      </h3>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job._id}
              className="bg-blue-50 rounded-lg p-4 flex justify-between items-center hover:bg-blue-100 transition-colors"
            >
              <Link to={`/job/${job._id}`} className="flex-1">
                <h4 className="font-bold text-blue-800">{job.title}</h4>
                <p className="text-gray-600">{job.company}</p>
              </Link>
              <div className="flex space-x-2">
                <Link to={`/admin/resumes/${job._id}`}>
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      fetchResumes(job._id);
                    }}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                  >
                    View Resumes
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
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
