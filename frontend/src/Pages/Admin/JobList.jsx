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
    <div className="bg-[#fdf6e3] border-2 border-yellow-800 shadow-2xl rounded-2xl p-6">
      <h3 className="text-3xl font-bold mb-6 flex items-center text-yellow-900">
        <FileText className="mr-3 text-yellow-700" /> Quests of the Realm
      </h3>
      {jobs.length === 0 ? (
        <p className="text-gray-700 italic">No quests have been declared yet.</p>
      ) : (
        <ul className="space-y-5">
          {jobs.map((job) => (
            <li
              key={job._id}
              className="bg-[#fffaf0] border border-yellow-700 rounded-xl p-5 flex justify-between items-center hover:bg-yellow-100 transition-colors duration-200"
            >
              <Link to={`/admin/job/${job._id}`} className="flex-1">

                <h4 className="text-xl font-semibold text-yellow-900">{job.title}</h4>
                <p className="text-gray-700 italic">House {job.company}</p>
              </Link>
              <div className="flex space-x-3">
                <Link to={`/admin/resumes/${job._id}`}>
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      fetchResumes(job._id);
                    }}
                    className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 shadow-sm"
                  >
                    View Ravens
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="bg-red-800 text-white px-3 py-2 rounded-md hover:bg-red-700 shadow-sm"
                  title="Banish Quest"
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
