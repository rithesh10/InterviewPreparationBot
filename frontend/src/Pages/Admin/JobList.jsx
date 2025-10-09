// import React from "react";
// import { FileText, Trash2 } from "lucide-react";
// import axios from "axios";
// import config from "../../config/config";
// import { Link } from "react-router-dom";

// const JobList = ({ jobs, fetchResumes, setSelectedJob, fetchJobs }) => {
//   const handleDeleteJob = async (jobId) => {
//   if (!window.confirm("Are you sure you want to delete this job?")) return;

//   try {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       alert("You must be logged in to delete a job.");
//       return;
//     }

//     await axios.delete(`${config.backendUrl}/jobs/jobs/${jobId}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     fetchJobs();
//     alert("Job deleted successfully!");
//   } catch (error) {
//     console.error("Error deleting job:", error);
//     alert("Failed to delete job. Please try again.");
//   }
// };


//   return (
//     <div className="bg-white shadow-xl rounded-xl p-6 max-w-4xl mx-auto mt-10">
//       <h3 className="text-3xl font-semibold mb-6 flex items-center text-gray-800">
//         <FileText className="mr-3 text-blue-600" size={24} /> Job Listings
//       </h3>
//       {jobs.length === 0 ? (
//         <p className="text-gray-500">No jobs posted yet.</p>
//       ) : (
//         <ul className="space-y-6">
//           {jobs.map((job) => (
//             <li
//               key={job._id}
//               className="bg-blue-50 rounded-lg p-5 flex justify-between items-center transition-transform transform hover:scale-105 hover:shadow-md"
//             >
//               <Link to={`/admin/job/${job._id}`} className="flex-1">
//                 <h4 className="font-semibold text-xl text-blue-800">{job.title}</h4>
//                 <p className="text-gray-700">{job.company}</p>
//               </Link>
//               <div className="flex space-x-4 items-center">
//                 <Link to={`/admin/resumes/${job._id}`}>
//                   <button
//                     onClick={() => {
//                       setSelectedJob(job);
//                       fetchResumes(job._id);
//                     }}
//                     className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
//                   >
//                     View Resumes
//                   </button>
//                 </Link>
//                 <button
//                   onClick={() => handleDeleteJob(job._id)}
//                   className="bg-red-500 text-white p-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default JobList;
import React from "react";
import { FileText, Trash2, Eye, Briefcase, Users, Calendar, Loader } from "lucide-react";
import axios from "axios";
import config from "../../config/config";
import { Link } from "react-router-dom";

const JobList = ({ jobs, fetchResumes, setSelectedJob, fetchJobs, isLoading }) => {
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("You must be logged in to delete a job.");
        return;
      }

      await axios.delete(`${config.backendUrl}/jobs/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      fetchJobs();
      alert("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job. Please try again.");
    }
  };

  const getStatusColor = (status) =>
    status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 max-w-5xl mx-auto mt-10 border border-gray-100">
      <h3 className="text-3xl font-semibold mb-6 flex items-center text-gray-800">
        <FileText className="mr-3 text-blue-600" size={26} /> Job Listings
      </h3>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No jobs posted yet. Create your first job listing!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-gradient-to-r from-white to-blue-50 p-5 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">{job.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {job.company || "Unknown Company"} • {job.location || "N/A"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    job.status
                  )}`}
                >
                  {job.status || "active"}
                </span>
              </div>

              <div className="flex items-center space-x-5 text-sm text-gray-600 mb-3">
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  {/* <span>{job.applicants || 0} applicants</span> */}
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {job.posted_date
                      ? new Date(job.posted_date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </span>
              </div>

              <div className="flex space-x-3">
                <Link to={`/admin/resumes/${job._id}`} className="flex-1">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      fetchResumes(job._id);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Resumes</span>
                  </button>
                </Link>

                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
