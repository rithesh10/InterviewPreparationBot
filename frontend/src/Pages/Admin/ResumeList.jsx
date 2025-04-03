import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import config from "../../config/config";
import ErrorAlert from "./ErrorAlert";

const ResumeList = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, [id]); // ✅ Fetch resumes when jobId changes

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${config.backendUrl}/resume/get-resume-jobId/${id}`,
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setResumes(response.data.resumes);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch the resumes");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateScores = async () => {
    try {
      await axios.get(`${config.backendUrl}/ranking/rank-job/${id}`);
    } catch (error) {
      console.error("Error calculating scores:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
      {/* Buttons */}
      <div className="flex justify-center items-center space-x-4 py-3">
        <button
          onClick={calculateScores}
          className="rounded-md bg-red-500 py-2 px-4 font-semibold text-white hover:bg-red-600 transition"
        >
          Calculate Scores
        </button>

        {/* Pass jobId to ResumeRankings */}
        <Link to={`/admin/resume-rankings/${id}`}>
          <button className="rounded-md bg-blue-500 py-2 px-4 font-semibold text-white hover:bg-blue-600 transition">
            View Rankings
          </button>
        </Link>
      </div>

      {/* Error Message */}
      {error && <ErrorAlert message={error} />}
      {message && <p className="text-gray-600">{message}</p>}

      {/* Loading or Resume List */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading resumes...</p>
      ) : resumes.length === 0 ? (
        <p className="text-center text-gray-500">No resumes received.</p>
      ) : (
        <ul className="space-y-4 mt-4">
          {resumes.map((resume) => (
            <li
              key={resume._id}
              className="flex items-center justify-between border-b pb-3"
            >
              {/* Link to individual resume details */}
              <Link to={`/admin/resumes/resume/${resume._id}`}>
                <button className="text-blue-600 font-medium hover:underline flex flex-col">
                  <span className="font-semibold">Experience: {resume.experience} years</span>
                  <span className="text-sm text-gray-600">{resume.user_name}</span>
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResumeList;
