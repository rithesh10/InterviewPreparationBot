// import React, { useState } from "react";
// import axios from "axios";
// import config from "../../config/config";

// const JobForm = ({ fetchJobs, setError }) => {
//   const [showForm, setShowForm] = useState(false);
//   const [newJob, setNewJob] = useState({
//     title: "", company: "", location: "", salary_range: "",
//     skills_required: "", application_deadline: "", experience_level: "",
//     employment_type: "", description: "", requirements: ""
//   });

//   const handleJobPost = async () => {
//   try {
//     const payload = {
//       ...newJob,
//       skills_required: newJob.skills_required.split(',').map(skill => skill.trim()),
//       requirements: newJob.requirements.split(',').map(req => req.trim()),
//       experience_level: parseInt(newJob.experience_level),
//       application_deadline: new Date(newJob.application_deadline).toISOString()
//     };

//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       setError("User is not authenticated. Please login again.");
//       return;
//     }

//     await axios.post(`${config.backendUrl}/jobs/jobs`, payload, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     fetchJobs();
//     setNewJob({
//       title: "", company: "", location: "", salary_range: "",
//       skills_required: "", application_deadline: "", experience_level: "",
//       employment_type: "", description: "", requirements: ""
//     });
//     setShowForm(false);
//     alert("Job posted successfully!");
//   } catch (error) {
//     setError("Failed to post job. Please try again.");
//   }
// };

//   return (
//     <>
//       <div className="bg-white border border-green-600 rounded-xl shadow-2xl p-6 flex justify-center items-center h-[250px] w-full md:w-[400px] mt-6 mx-auto">
//         <button
//           onClick={() => setShowForm(true)}
//           className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg mt-4 transition font-semibold text-lg shadow-md"
//         >
//           Post Job
//         </button>
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
//           <div className="bg-white text-gray-900 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-green-700 relative font-sans">

//             <button
//               onClick={() => setShowForm(false)}
//               className="absolute top-2 right-3 text-green-600 hover:text-green-800 text-3xl font-extrabold"
//             >
//               &times;
//             </button>

//             <h3 className="text-2xl font-bold text-green-700 mb-6 text-center uppercase tracking-wider">
//               Post a New Job
//             </h3>

//             {[
//               { placeholder: "Job Title", field: "title" },
//               { placeholder: "Company", field: "company" },
//               { placeholder: "Location", field: "location" },
//               { placeholder: "Salary Range", field: "salary_range" },
//               { placeholder: "Skills (comma-separated)", field: "skills_required" },
//               { placeholder: "Requirements (comma-separated)", field: "requirements" },
//               { placeholder: "Application Deadline", field: "application_deadline", type: "date" },
//               { placeholder: "Experience Level (e.g. 0, 1, 2...)", field: "experience_level", type: "number" },
//               { placeholder: "Employment Type", field: "employment_type" },
//             ].map(({ placeholder, field, type = "text" }) => (
//               <input
//                 key={field}
//                 type={type}
//                 placeholder={placeholder}
//                 value={newJob[field]}
//                 onChange={(e) => setNewJob({ ...newJob, [field]: e.target.value })}
//                 className="w-full p-3 mb-4 rounded-md bg-gray-100 border border-green-500 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             ))}

//             <textarea
//               placeholder="Job Description"
//               value={newJob.description}
//               onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
//               className="w-full p-3 mb-6 rounded-md bg-gray-100 border border-green-500 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />

//             <button
//               onClick={handleJobPost}
//               className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-lg transition focus:outline-none focus:ring-4 focus:ring-green-300"
//             >
//               Submit Job
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default JobForm;
import React, { useState } from "react";
import axios from "axios";
import config from "../../config/config";
import { Plus, Loader, X } from "lucide-react";

const JobForm = ({ fetchJobs, setError, setSuccess }) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    salary_range: "",
    skills_required: "",
    application_deadline: "",
    experience_level: "",
    employment_type: "",
    description: "",
    requirements: "",
  });

  const handleJobPost = async () => {
    if (!newJob.title || !newJob.company || !newJob.location) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...newJob,
        skills_required: newJob.skills_required
          .split(",")
          .map((skill) => skill.trim()),
        requirements: newJob.requirements
          .split(",")
          .map((req) => req.trim()),
        experience_level: parseInt(newJob.experience_level) || 0,
        application_deadline: new Date(
          newJob.application_deadline
        ).toISOString(),
      };

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("User is not authenticated. Please login again.");
        return;
      }

      await axios.post(`${config.backendUrl}/jobs/jobs`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      fetchJobs();
      setNewJob({
        title: "",
        company: "",
        location: "",
        salary_range: "",
        skills_required: "",
        application_deadline: "",
        experience_level: "",
        employment_type: "",
        description: "",
        requirements: "",
      });
      setShowForm(false);
      setSuccess("Job posted successfully!");
    } catch (error) {
      setError("Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Main Card */}
      <div className="bg-white border border-blue-300 rounded-2xl shadow-xl p-8 flex justify-center items-center h-[260px] w-full md:w-[420px] mt-6 mx-auto hover:shadow-2xl transition-shadow duration-300">
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all font-semibold text-lg shadow-md flex justify-center items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Post a New Job</span>
        </button>
      </div>

      {/* Popup Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
          <div className="bg-white text-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-blue-500 relative font-sans">
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-4 text-blue-700 hover:text-blue-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title */}
            <h3 className="text-3xl font-bold text-blue-700 mb-8 text-center flex items-center justify-center space-x-2">
              <Plus className="w-6 h-6" />
              <span>Post New Job</span>
            </h3>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Job Title *", field: "title" },
                { label: "Company *", field: "company" },
                { label: "Location *", field: "location" },
                { label: "Salary Range", field: "salary_range" },
                {
                  label: "Skills (comma-separated)",
                  field: "skills_required",
                },
                {
                  label: "Requirements (comma-separated)",
                  field: "requirements",
                },
                {
                  label: "Application Deadline",
                  field: "application_deadline",
                  type: "date",
                },
                {
                  label: "Experience Level (0, 1, 2...)",
                  field: "experience_level",
                  type: "number",
                },
                { label: "Employment Type", field: "employment_type" },
              ].map(({ label, field, type = "text" }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={newJob[field]}
                    onChange={(e) =>
                      setNewJob({ ...newJob, [field]: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                value={newJob.description}
                onChange={(e) =>
                  setNewJob({ ...newJob, description: e.target.value })
                }
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe the role and responsibilities..."
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleJobPost}
              disabled={isSubmitting}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Submit Job</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default JobForm;
