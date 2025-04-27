import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config/config"; // Assuming this contains your backend URL

const Interview = ({ userId }) => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle the case where userId is not available
  useEffect(() => { 
    if (!userId) {
      setError("No user ID provided.");
    } else {
      fetchResume(); // Fetch the resume when userId is available
    }
  }, [userId]); // Runs whenever userId changes

  const fetchResume = async () => {
    if (!userId) {
      setError("No user ID available.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous error
    setResume(null); // Clear previous resume data

    try {
      const response = await axios.get(
        `${config.backendUrl}/get-resume-by-userId/${userId}`);
      console.log("data1"+response.data);
      // Handle successful response
      if (response.data) {
        if (response.data.resume) {
          setResume(response.data.resume); // Assuming the response contains 'resume' object
        } else {
          setError("No resume found for the given user ID.");
        }
      } else {
        setError("No data returned from the server.");
      }
    } catch (err) {
      setError("Error fetching resume: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Fetch Resume by User ID</h1>

      <div className="space-y-6">
        {/* Button to Fetch Resume */}
        <button
          onClick={fetchResume}
          disabled={loading}
          className={`w-full text-white px-6 py-3 rounded-md ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Fetching..." : "Fetch Resume"}
        </button>

        {/* Display Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Display Resume Data */}
        {resume && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Resume Details:</h2>
            <pre className="text-gray-700 whitespace-pre-wrap">{JSON.stringify(resume, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interview;