import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config/config";

const ResumeDetail = () => {
  const { id } = useParams();
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
    } catch (err) {
      setError("Failed to load resume details.");
    }
  };

  if (error) return <p className="text-red-600 font-medium">{error}</p>;
  if (!resume) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8 mt-8">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Resume of {resume.user_name}</h2>
      <div className="space-y-4">
        <p className="text-lg"><strong className="font-medium">Experience:</strong> {resume.experience} years</p>
        <p className="text-lg"><strong className="font-medium">User ID:</strong> {resume.user_id}</p>
        <p className="text-lg"><strong className="font-medium">Job ID:</strong> {resume.job_id}</p>
      </div>

      <div className="mt-6">
        <a
          href={resume.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
        >
          Download Resume (PDF)
        </a>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-md shadow-inner">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Resume Text</h3>
        <p className="whitespace-pre-line text-gray-700">{resume.resume_text}</p>
      </div>
    </div>
  );
};

export default ResumeDetail;
