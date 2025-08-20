import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config/config";

const ResumeDetail = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [loadingRanking, setLoadingRanking] = useState(false);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("User is not authenticated. Please login again.");
        return;
      }

      const response = await axios.get(`${config.backendUrl}/resume/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setResume(response.data.resume);
    } catch (err) {
      setError("Failed to load resume details.");
    }
  };

  const fetchRanking = async () => {
    try {
      setLoadingRanking(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("User is not authenticated. Please login again.");
        return;
      }

      // Step 1: Get resume ranking id
      const rankingRes = await axios.get(
        `${config.backendUrl}/ranking/resume-rankings-by-resume-id/${id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const rankingId = rankingRes.data?.inserted_id;
      if (!rankingId) {
        setError("No ranking data found for this resume.");
        return;
      }

      // Step 2: Get ranking details
      const detailsRes = await axios.get(
        `${config.backendUrl}/ranking/resume-rankings/${rankingId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setRanking(detailsRes.data);
    } catch (err) {
      setError("Failed to load AI ranking.");
    } finally {
      setLoadingRanking(false);
    }
  };

  if (error) return <p className="text-red-600 font-medium">{error}</p>;
  if (!resume) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-10 mt-10">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Resume of {resume.user_name}
      </h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
        <p>
          <strong className="font-semibold text-gray-800">Experience:</strong>{" "}
          {resume.experience} years
        </p>
      </div>

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Skills</h3>
          <div className="flex flex-wrap gap-4">
            {resume.skills.map((skill, index) => (
              <div
                key={index}
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="relative flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <span className="text-gray-800 font-semibold text-sm tracking-wide">
                    {skill}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download Resume */}
      <div className="mt-8 text-center">
        <a
          href={resume.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Download Resume (PDF)
        </a>
      </div>

      {/* AI Ranking Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchRanking}
          disabled={loadingRanking}
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-300 disabled:opacity-50"
        >
          {loadingRanking ? "Fetching AI Ranking..." : "View AI Ranking"}
        </button>
      </div>

      {/* AI Ranking Results */}
      {ranking && (
        <div className="mt-10 p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            AI Resume Ranking
          </h3>
          <p className="text-lg">
            <strong>AI Score:</strong>{" "}
            <span className="text-blue-700 font-bold">{ranking.ai_score}</span>
          </p>
          <p className="mt-2">
            <strong>Experience Match:</strong>{" "}
            {ranking.experience_match ? (
              <span className="text-green-600 font-semibold">Yes ✅</span>
            ) : (
              <span className="text-red-600 font-semibold">No ❌</span>
            )}
          </p>
          <div className="mt-4">
            <strong>Matching Skills:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {ranking.matching_skills?.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <strong>Missing Skills:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {ranking.missing_skills?.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-4 text-gray-700 italic">
            💡 {ranking.suggestions}
          </p>
        </div>
      )}

      {/* Resume Text */}
      <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Resume Text
        </h3>
        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
          {resume.resume_text}
        </p>
      </div>
    </div>
  );
};

export default ResumeDetail;
