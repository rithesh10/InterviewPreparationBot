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
  }, [id]);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("User is not authenticated. Please login again.");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(
        `${config.backendUrl}/resume/get-resume-jobId/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
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
      fetchResumes(); // refresh after calculating scores
    } catch (error) {
      console.error("Error calculating scores:", error);
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-10 mt-10 max-w-5xl mx-auto border border-gray-200">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Resumes for Job ID: <span className="text-blue-600">{id}</span>
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={calculateScores}
            className="rounded-lg bg-red-500 py-2 px-5 text-white font-semibold hover:bg-red-600 shadow-md transition-all duration-300"
          >
            Calculate Scores
          </button>

          <Link to={`/admin/resume-rankings/${id}`}>
            <button className="rounded-lg bg-blue-500 py-2 px-5 text-white font-semibold hover:bg-blue-600 shadow-md transition-all duration-300">
              View Rankings
            </button>
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {error && <ErrorAlert message={error} />}
      {message && (
        <p className="text-gray-600 text-center bg-gray-50 p-3 rounded-lg mb-6">
          {message}
        </p>
      )}

      {/* Resume List */}
      {isLoading ? (
        <p className="text-center text-gray-500 italic">Loading resumes...</p>
      ) : resumes.length === 0 ? (
        <p className="text-center text-gray-500 italic">No resumes received yet.</p>
      ) : (
        <ul className="space-y-4">
          {resumes.map((resume) => (
            <li
              key={resume._id}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:bg-gray-100 transition-all duration-300"
            >
              <Link to={`/admin/resumes/resume/${resume._id}`} className="flex-1">
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    Experience: {resume.experience} years
                  </p>
                  <p className="text-sm text-gray-600">{resume.user_name}</p>
                </div>
              </Link>
              <Link
                to={`/admin/resumes/resume/${resume._id}`}
                className="ml-4"
              >
                <button className="text-blue-600 font-medium hover:underline">
                  View Details →
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
