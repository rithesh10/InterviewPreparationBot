import React, { useState } from "react";
import axios from "axios";
import config from "../../config/config";

const JobForm = ({ fetchJobs, setError }) => {
  const [newJob, setNewJob] = useState({
    title: "", company: "", location: "", salary_range: "",
    skills_required: "", application_deadline: "", experience_level: "",
    employment_type: "", description: "", requirements: ""
  });

  const handleJobPost = async () => {
    try {
      await axios.post(`${config.backendUrl}/jobs/jobs`, {
        ...newJob,
        skills_required: newJob.skills_required.split(',').map(skill => skill.trim())
      }, { withCredentials: true });

      fetchJobs();
      setNewJob({ title: "", company: "", location: "", salary_range: "", skills_required: "", application_deadline: "", experience_level: "", employment_type: "", description: "", requirements: "" });
      alert("Job posted successfully!");
    } catch (error) {
      setError("Failed to post job. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-6">
      <h3 className="text-2xl font-semibold mb-4">Post New Job</h3>
      <input type="text" placeholder="Job Title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} className="w-full p-3 border rounded-lg" />
      <button onClick={handleJobPost} className="w-full bg-green-500 text-white p-3 rounded-lg mt-4">Post Job</button>
    </div>
  );
};

export default JobForm;
