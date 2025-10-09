import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import config from "../../config/config";
import ErrorAlert from "./ErrorAlert";
import { FileText, Loader2, ListOrdered, RefreshCw, User } from "lucide-react";

const ResumeList = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
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
      setResumes(response.data.resumes || []);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch the resumes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateScores = async () => {
    setIsCalculating(true);
    try {
      await axios.get(`${config.backendUrl}/ranking/rank-job/${id}`);
      await fetchResumes(); // refresh after calculating scores
    } catch (error) {
      console.error("Error calculating scores:", error);
      setError("Failed to calculate scores. Try again later.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-10 mt-10 max-w-5xl mx-auto border border-gray-100 transition-all duration-300">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
          <FileText className="text-blue-600 w-7 h-7" />
          <span>
            Resumes for Job ID: <span className="text-blue-600">{id}</span>
          </span>
        </h1>

        <div className="flex space-x-3">
          <button
            onClick={calculateScores}
            disabled={isCalculating || isLoading}
            className={`flex items-center space-x-2 rounded-lg py-2 px-5 font-semibold shadow-md transition-all duration-300 ${
              isCalculating || isLoading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Calculate Scores</span>
              </>
            )}
          </button>

          <Link to={`/admin/resume-rankings/${id}`}>
            <button
              disabled={isCalculating}
              className={`flex items-center space-x-2 rounded-lg py-2 px-5 font-semibold shadow-md transition-all duration-300 ${
                isCalculating
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <ListOrdered className="w-5 h-5" />
              <span>View Rankings</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {error && <ErrorAlert message={error} />}
      {message && (
        <p className="text-gray-700 text-center bg-blue-50 p-3 rounded-lg mb-6 border border-blue-100">
          {message}
        </p>
      )}

      {/* Resume List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12 text-gray-500">
          <Loader2 className="animate-spin w-6 h-6 mr-2 text-blue-600" />
          <span>Loading resumes...</span>
        </div>
      ) : resumes.length === 0 ? (
        <p className="text-center text-gray-500 italic py-10">
          No resumes received yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {resumes.map((resume) => (
            <li
              key={resume._id}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:bg-gray-100 transition-all duration-300"
            >
              <Link
                to={`/admin/resumes/resume/${resume._id}`}
                className="flex items-center space-x-3 flex-1"
              >
                <User className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {resume.user_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Experience: {resume.experience} years
                  </p>
                </div>
              </Link>
              <Link to={`/admin/resumes/resume/${resume._id}`}>
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
