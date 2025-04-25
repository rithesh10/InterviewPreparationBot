import React, { useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import config from "../../config/config";
import axios from "axios";
import Select from "react-select";

const predefinedSkills = [
  "JavaScript", "Python", "Java", "C", "C++",
  "HTML", "CSS", "React", "Tailwind CSS", "Bootstrap",
  "Node.js", "Express.js", "Django", "Flask",
  "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Firebase",
  "Git", "GitHub", "VS Code", "Postman",
  "Jest", "Mocha", "Selenium",
  "Docker", "GitHub Actions",
  "AWS", "Heroku",
  "NumPy", "Pandas", "Matplotlib", "Scikit-learn", "Jupyter Notebook"
].map(skill => ({ label: skill, value: skill }));

const ResumeUpload = ({ job, onBack }) => {
  const [resume, setResume] = useState(null);
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file && !["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      setAlert({ type: "error", message: "Only PDF, DOC, and DOCX files are allowed." });
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setAlert({ type: "error", message: "File size must be under 5MB." });
      return;
    }
    setAlert({ type: "", message: "" });
    setResume(file);
  };

  const handleSkillChange = (selectedOptions) => {
    setSkills(selectedOptions.map(option => option.value));
  };

  const handleJobApplication = async () => {
    if (!experience || experience < 0) {
      return setAlert({ type: "error", message: "Please enter valid experience." });
    }

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const formData = new FormData();
      formData.append("_id", job._id);
      formData.append("experience", experience);
      formData.append("resume", resume);
      skills.forEach((skill, index) => {
        formData.append(`skills[${index}]`, skill);
      });

      await axios.post(
        `${config.backendUrl}/resume/upload-resume`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setAlert({ type: "success", message: "Application submitted successfully." });
      setResume(null);
      setExperience("");
      setSkills([]);
    } catch (error) {
      console.error("Submission error:", error);
      setAlert({ type: "error", message: "Error submitting application. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (base) => ({
      ...base,
      background: "#1e293b", // slate-800
      borderColor: "#9f8c56", // Custom gold
      color: "#d1d5db",
      "&:hover": {
        borderColor: "#d4af37" // Brighter gold on hover
      }
    }),
    menu: (base) => ({
      ...base,
      background: "#1e293b", // slate-800
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#374151" : "#1e293b", // gray-700 on focus, slate-800 default
      color: "#f3f4f6", // gray-100
      "&:active": {
        backgroundColor: "#4b5563" // gray-600
      }
    }),
    input: (base) => ({
      ...base,
      color: "#f3f4f6" // gray-100
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af" // gray-400
    }),
    singleValue: (base) => ({
      ...base,
      color: "#f3f4f6" // gray-100
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#4b5563" // gray-600
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#d4af37" // gold
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#d4af37",
      "&:hover": {
        backgroundColor: "#7f1d1d", // red-900
        color: "#f3f4f6"
      }
    })
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900 bg-[url('https://api.placeholder.com/300/300')] bg-blend-overlay bg-opacity-90 font-serif">
      <div className="w-full max-w-lg bg-slate-800 p-6 rounded-lg shadow-2xl space-y-4 border-2 border-yellow-700 relative">
        {/* Decorative elements */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-yellow-900 via-yellow-600 to-yellow-900"></div>
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-yellow-900 via-yellow-600 to-yellow-900"></div>
        
        <h2 className="text-3xl font-bold text-center text-yellow-600">Pledge to the Realm</h2>
        <p className="text-gray-400 text-center text-sm italic">"When you play the game of thrones, you win or you die"</p>

        {/* Alert Message */}
        {alert.message && (
          <div className={`text-sm px-4 py-2 rounded-md ${
            alert.type === "error" ? "bg-red-900 text-gray-200 border border-red-700" : "bg-green-900 text-gray-200 border border-green-700"
          }`}>
            {alert.message}
          </div>
        )}

        {/* Experience Input */}
        <div>
          <label className="block text-sm font-semibold text-yellow-600">Years in Service</label>
          <input
            type="number"
            className="w-full mt-1 p-2 border border-yellow-800 rounded-md bg-slate-700 text-gray-200 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
            value={experience}
            min="0"
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Enter your years of experience"
          />
        </div>

        {/* Skills Multi Select */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-yellow-600">Your Talents</label>
          <Select
            options={predefinedSkills}
            isMulti
            onChange={handleSkillChange}
            placeholder="Select your skills"
            className="text-sm"
            styles={selectStyles}
          />
          <div className="flex flex-wrap mt-2">
            {skills.map((skill, index) => (
              <span key={index} className="bg-slate-700 text-yellow-500 px-3 py-1 rounded-full m-1 text-xs border border-yellow-800">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Resume Upload */}
        <label className="flex items-center justify-center gap-2 bg-red-900 text-gray-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-red-800 transition border border-red-700">
          <UploadCloud className="w-5 h-5" />
          <span>{resume ? resume.name : "Present Your Scroll"}</span>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
          />
        </label>

        {/* Submit Button */}
        {resume && (
          <button
            onClick={handleJobApplication}
            disabled={loading}
            className="mt-3 bg-yellow-800 text-gray-200 px-4 py-2 rounded-lg hover:bg-yellow-700 transition w-full flex items-center justify-center gap-2 border border-yellow-600"
          >
            {loading && <Loader2 className="animate-spin h-4 w-4" />}
            {loading ? "Sending Raven..." : "Swear Your Fealty"}
          </button>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition w-full border border-gray-600"
        >
          Return to the Wall
        </button>
        
        {/* Footer with sigil */}
        <div className="flex justify-center mt-4">
          <div className="h-8 w-8 border-2 border-yellow-700 rounded-full flex items-center justify-center">
            <div className="h-6 w-6 bg-yellow-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;