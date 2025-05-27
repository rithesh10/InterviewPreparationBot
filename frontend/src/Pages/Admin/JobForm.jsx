import React, { useState } from "react";
import axios from "axios";
import config from "../../config/config";

const JobForm = ({ fetchJobs, setError }) => {
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "", company: "", location: "", salary_range: "",
    skills_required: "", application_deadline: "", experience_level: "",
    employment_type: "", description: "", requirements: ""
  });

  const handleJobPost = async () => {
    try {
      const payload = {
        ...newJob,
        skills_required: newJob.skills_required.split(',').map(skill => skill.trim()),
        requirements: newJob.requirements.split(',').map(req => req.trim()),
        experience_level: parseInt(newJob.experience_level),
        application_deadline: new Date(newJob.application_deadline).toISOString()
      };

      await axios.post(`${config.backendUrl}/jobs/jobs`, payload, { withCredentials: true });

      fetchJobs();
      setNewJob({
        title: "", company: "", location: "", salary_range: "",
        skills_required: "", application_deadline: "", experience_level: "",
        employment_type: "", description: "", requirements: ""
      });
      setShowForm(false);
      alert("Job posted successfully!");
    } catch (error) {
      setError("Failed to post job. Please try again.");
    }
  };

  return (
    <>
      <div className="bg-white border border-green-600 rounded-xl shadow-2xl p-6 flex justify-center items-center h-[250px] w-full md:w-[400px] mt-6 mx-auto">
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg mt-4 transition font-semibold text-lg shadow-md"
        >
          Post Job
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
          <div className="bg-white text-gray-900 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-green-700 relative font-sans">

            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-green-600 hover:text-green-800 text-3xl font-extrabold"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold text-green-700 mb-6 text-center uppercase tracking-wider">
              Post a New Job
            </h3>

            {[
              { placeholder: "Job Title", field: "title" },
              { placeholder: "Company", field: "company" },
              { placeholder: "Location", field: "location" },
              { placeholder: "Salary Range", field: "salary_range" },
              { placeholder: "Skills (comma-separated)", field: "skills_required" },
              { placeholder: "Requirements (comma-separated)", field: "requirements" },
              { placeholder: "Application Deadline", field: "application_deadline", type: "date" },
              { placeholder: "Experience Level (e.g. 0, 1, 2...)", field: "experience_level", type: "number" },
              { placeholder: "Employment Type", field: "employment_type" },
            ].map(({ placeholder, field, type = "text" }) => (
              <input
                key={field}
                type={type}
                placeholder={placeholder}
                value={newJob[field]}
                onChange={(e) => setNewJob({ ...newJob, [field]: e.target.value })}
                className="w-full p-3 mb-4 rounded-md bg-gray-100 border border-green-500 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ))}

            <textarea
              placeholder="Job Description"
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              className="w-full p-3 mb-6 rounded-md bg-gray-100 border border-green-500 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={handleJobPost}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-lg transition focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              Submit Job
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default JobForm;
