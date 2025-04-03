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
  
      console.log("Application submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-96 bg-white p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-center">Apply for Job</h2>

        {/* Experience Input */}
        <div>
          <label className="block font-semibold">Experience (years)</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Enter your experience"
          />
        </div>

        {/* Skills Input */}
        <div>
          <label className="block font-semibold">Skills</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Enter a skill"
            />
            <button
              onClick={handleAddSkill}
              className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap mt-2">
            {skills.map((skill, index) => (
              <span key={index} className="bg-gray-200 px-3 py-1 rounded-md m-1">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Resume Upload */}
        <label className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition">
          <UploadCloud className="mr-2" />
          <span>{resume ? resume.name : "Upload Resume"}</span>
          <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
        </label>

        {/* Submit Button */}
        {resume && (
          <button
            onClick={handleJobApplication}
            className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Submit Application
          </button>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mt-3 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition w-full"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;
