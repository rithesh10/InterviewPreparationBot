import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import config from "../../config/config";
import axios from "axios";

const ResumeUpload = ({ job, onBack }) => {
  const [resume, setResume] = useState(null);
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  // Handle resume upload
  const handleResumeUpload = (event) => setResume(event.target.files[0]);

  // Add skill to the list
  const handleAddSkill = () => {
    if (skillInput.trim() !== "") {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  // Handle form submission
  const handleJobApplication = async () => {
    try {
      const formData = new FormData();
      formData.append("_id", job._id);
      formData.append("experience", experience);
      formData.append("resume", resume);

      // Append skills as an array
      skills.forEach((skill, index) => {
        formData.append(`skills[${index}]`, skill);
      });

      const response = await axios.post(
        `${config.backendUrl}/resume/upload-resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Ensure cookies are sent
        }
      );
      alert("Application submitted successfully");
      console.log("Application submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full sm:w-96 bg-white p-8 rounded-lg shadow-xl space-y-6">
        <h2 className="text-3xl font-semibold text-center text-blue-600">Apply for Job</h2>

        {/* Experience Input */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Experience (years)</label>
          <input
            type="number"
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Enter your experience"
          />
        </div>

        {/* Skills Input */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Skills</label>
          <div className="flex items-center mt-2 space-x-2">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Enter a skill"
            />
            <button
              onClick={handleAddSkill}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap mt-3">
            {skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg m-1">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Resume Upload */}
        <div>
          <label className="flex items-center bg-blue-600 text-white px-5 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition">
            <UploadCloud className="mr-3" />
            <span>{resume ? resume.name : "Upload Resume"}</span>
            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
          </label>
        </div>

        {/* Submit Button */}
        {resume && (
          <button
            onClick={handleJobApplication}
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Submit Application
          </button>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mt-4 w-full bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;
