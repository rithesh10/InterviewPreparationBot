import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config/config"; 
import Test from "./Test"; 

const Interview = ({ userId }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("No user ID provided.");
    } else {
      fetchResumes();
    }
  }, [userId]);

  const fetchResumes = async () => {
    if (!userId) {
      setError("No user ID available.");
      return;
    }

    setLoading(true);
    setError("");
    setResumes([]);

    try {
      const response = await axios.get(`${config.backendUrl}/resume/get-resume-by-userId/${userId}`, {
        withCredentials: true,
      });

      if (response.data && response.data.resumes && response.data.resumes.length > 0) {
        const resumesWithJob = await Promise.all(
          response.data.resumes.map(async (resume) => {
            if (resume.job_id) {
              try {
                const jobResponse = await axios.get(`${config.backendUrl}/jobs/job/${resume.job_id}`, {
                  withCredentials: true,
                });
                return {
                  ...resume,
                  job: jobResponse.data.job || null,
                };
              } catch (jobErr) {
                console.error("Error fetching job:", jobErr);
                return { ...resume, job: null };
              }
            } else {
              return { ...resume, job: null };
            }
          })
        );
        setResumes(resumesWithJob);
      } else {
        setError("No resumes found for the given user ID.");
      }
    } catch (err) {
      setError("Error fetching resumes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = (resumeText, jobDescription) => {
    setSelectedInterview({ resumeText, jobDescription }); 
  };

  if (selectedInterview) {
    return (
      <Test
        resumeText={selectedInterview.resumeText}
        jobDescription={selectedInterview.jobDescription}
        onBack={() => setSelectedInterview(null)} 
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Fetch Resumes by User ID</h1>

      <div className="space-y-6">
        <button
          onClick={fetchResumes}
          disabled={loading}
          className={`w-full text-white px-6 py-3 rounded-md ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Fetching..." : "Fetch Resumes"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {resumes.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6">
            {resumes.map((resume) => (
              <div key={resume._id} className="p-6 bg-gray-50 border rounded-lg shadow-md">
                {resume.job && (
                  <>
                    <p className="mb-2">
                      <span className="text-xl font-semibold">{resume.job.title}</span>
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Company:</span> {resume.job.company}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Location:</span> {resume.job.location}
                    </p>
                  </>
                )}

                <p className="mb-2">
                  <span className="font-medium">Experience:</span> {resume.experience} years
                </p>

                <button
                  onClick={() => startInterview(resume.resume_text, resume.job?.description || "")}
                  className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Start Interview
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Interview;