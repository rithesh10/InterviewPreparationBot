import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config/config";

const ResumeDetail = () => {
  const { id } = useParams(); // Get resume ID from URL
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/resume/${id}`, {
        withCredentials: true,
      });
      setResume(response.data.resume);
      console.log(resume)
    } catch (err) {
      setError("Failed to load resume details.");
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!resume) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Resume of {resume.user_name}</h2>
      <p><strong>Experience:</strong> {resume.experience} years</p>
      <p><strong>User ID:</strong> {resume.user_id}</p>
      <p><strong>Job ID:</strong> {resume.job_id}</p>
      
      <div className="mt-4">
        <a 
          href={resume.file_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Download Resume (PDF)
        </a>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-y-auto max-h-60">
        <h3 className="text-xl font-semibold mb-2">Resume Text</h3>
        <p className="whitespace-pre-line text-sm">{resume.resume_text}</p>
      </div>
    </div>
  );
};

export default ResumeDetail;
