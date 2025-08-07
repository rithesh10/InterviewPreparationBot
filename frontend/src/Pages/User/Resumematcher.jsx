import React, { useState } from 'react';
import axios from "axios";
import config from "../../config/config";
import { Upload, FileText, Briefcase, Target, AlertCircle } from 'lucide-react';

const ResumeMatcher = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF, DOC, DOCX, or TXT file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      
      setResumeFile(file);
      setError('');
    }
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!resumeFile) {
      setError('Please upload a resume file');
      return;
    }
    
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      const response = await axios.post(
        `${config.backendUrl}/matcher/resume-matcher`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = response.data();
      setResults(data);
    }
    catch (err) {
      console.log("Error fetching jobs:", err);
    }
    setLoading(false);
    setResults({ score: 70, missingKeywords: ["Communication", "System design", "Team collaboration"] });
  };

  const resetForm = () => {
    setResumeFile(null);
    setJobDescription('');
    setResults(null);
    setError('');
    const fileInput = document.getElementById('resume-upload');
    if (fileInput) fileInput.value = '';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Matcher</h1>
          <p className="text-gray-600">
            Upload your resume and job description to see how well they match
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Upload Resume
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="resume-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="resume-upload"
                        name="resume-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleResumeUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT up to 5MB</p>
                </div>
              </div>
              {resumeFile && (
                <div className="mt-2 text-sm text-green-600 flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  {resumeFile.name}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline w-4 h-4 mr-1" />
                Job Description
              </label>
              <textarea
                id="job-description"
                name="job-description"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={handleJobDescriptionChange}
              />
            </div>

            {error && (
              <div className="flex items-center p-3 text-red-700 bg-red-100 rounded-md">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-md font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Target className="w-5 h-5 mr-2" />
                    Analyze Match
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {results && (
          <div className="space-y-6">
            <div className={`${getScoreBgColor(results.score)} rounded-lg p-6`}>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Score</h2>
                <div className={`text-6xl font-bold ${getScoreColor(results.score)} mb-2`}>
                  {results.score}%
                </div>
                <p className="text-gray-600">
                  {results.score >= 80 ? 'Excellent match!' : 
                   results.score >= 60 ? 'Good match with room for improvement' : 
                   'Consider updating your resume'}
                </p>
              </div>
            </div>

            {results.missingKeywords && results.missingKeywords.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-red-500" />
                  Missing Keywords ({results.missingKeywords.length})
                </h3>
                <p className="text-gray-600 mb-4">
                  Consider adding these keywords to improve your resume match:
                </p>
                <div className="flex flex-wrap gap-2">
                  {results.missingKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeMatcher;