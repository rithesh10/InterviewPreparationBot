import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config/config";

const ResumeDetail = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${config.backendUrl}/resume/${id}`, {
          withCredentials: true,
        });
        setResume(response.data.resume);
      } catch (err) {
        setError("Failed to load resume details.");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  const getHouseColor = (userName) => {
    const lowerName = userName.toLowerCase();
    if (lowerName.includes("stark")) return "bg-gray-900 text-gray-100";
    if (lowerName.includes("lannister")) return "bg-red-800 text-yellow-200";
    if (lowerName.includes("targaryen")) return "bg-red-900 text-gray-100";
    if (lowerName.includes("baratheon")) return "bg-yellow-700 text-black";
    if (lowerName.includes("tyrell")) return "bg-green-800 text-gray-100";
    return "bg-gray-800 text-gray-300";
  };

  const houseColors = getHouseColor(resume?.user_name || "");

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-red-500 bg-gray-800 text-white py-4 px-6 rounded-md">{error}</p>
    </div>
  );
  if (!resume) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-gray-400 bg-gray-900 py-4 px-6 rounded-md">No resume details available.</p>
    </div>
  );

  return (
    <div className={`min-h-screen ${houseColors} py-12 bg-repeat bg-center`} style={{ backgroundImage: 'url(/images/parchment-texture.jpg)' }}> {/* Example texture */}
      <div className="max-w-3xl mx-auto rounded-lg shadow-xl overflow-hidden">
        <div className="relative overflow-hidden rounded-t-lg">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-70"></div>
          <div className="relative p-8">
            <h2 className="text-4xl font-bold mb-4 tracking-wide uppercase text-yellow-300">{resume.user_name}'s Decree</h2>
            <p className="text-lg text-gray-300 italic">By the word and honor of their house...</p>
          </div>
        </div>
        <div className="bg-gray-800 p-8 rounded-b-lg space-y-8 text-gray-200">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <strong className="text-yellow-300 uppercase tracking-wider block mb-2">Experience:</strong>
              <span className="text-lg">{resume.experience} Years</span>
            </div>
            {/* <div>
              <strong className="text-yellow-300 uppercase tracking-wider block mb-2">User ID:</strong>
              <span className="font-mono text-lg">{resume.user_id}</span>
            </div>
            <div>
              <strong className="text-yellow-300 uppercase tracking-wider block mb-2">Job ID:</strong>
              <span className="font-mono text-lg">{resume.job_id}</span>
            </div> */}
            <div>
              <strong className="text-yellow-300 uppercase tracking-wider block mb-2">Presented On:</strong>
              <span className="text-lg">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-8">
            <a
              href={resume.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline uppercase tracking-wider text-lg"
            >
              Read the Full Proclamation <span className="text-sm">(PDF)</span>
            </a>
          </div>

          <div className="mt-8 p-6 bg-gray-900 rounded-md overflow-y-auto max-h-96 text-gray-300">
            <h3 className="text-xl font-semibold mb-3 text-yellow-300 uppercase tracking-wider">Contained Scrolls</h3>
            <pre className="whitespace-pre-line text-sm font-mono text-gray-400">{resume.resume_text}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetail;