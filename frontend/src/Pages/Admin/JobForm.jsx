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
      {/* Themed Button */}
      <div className="bg-[#1a1a1a] border border-yellow-700 rounded-xl shadow-2xl p-6 flex justify-center items-center h-[250px] w-full md:w-[400px] mt-6 mx-auto">
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-yellow-700 to-yellow-900 text-white font-bold tracking-wide px-6 py-3 rounded-full shadow-lg hover:from-yellow-800 hover:to-yellow-950 transition-all duration-300 text-lg"
        >
          🐉 Post  Job
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4 font-serif">
          <div className="bg-[#111] text-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-yellow-800 relative">

            {/* Close button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-yellow-400 hover:text-yellow-600 text-3xl font-extrabold"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold text-yellow-500 mb-4 text-center uppercase tracking-wider">
              Post a New Scroll of Opportunity
            </h3>

            {/* Input fields */}
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
                className="w-full p-2 mb-3 rounded-md bg-[#222] border border-yellow-600 text-white placeholder-gray-400"
              />
            ))}

            <textarea
              placeholder="Job Description"
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              className="w-full p-2 mb-4 rounded-md bg-[#222] border border-yellow-600 text-white placeholder-gray-400"
            />

            <button
              onClick={handleJobPost}
              className="w-full bg-yellow-700 text-white py-2 rounded-md hover:bg-yellow-800 transition font-bold text-lg"
            >
              🛡️ Submit Scroll
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default JobForm;
