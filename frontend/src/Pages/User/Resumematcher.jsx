import React, { useState } from 'react';
import { Upload, FileText, Briefcase, Target, AlertCircle, CheckCircle2, XCircle, TrendingUp, Award, BarChart3, Zap } from 'lucide-react';
import config from "../../config/config";
import axios from 'axios';

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
  setResults(null);

  try {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("User is not authenticated. Please login again.");
      return; 
    }

    const response = await axios.post(
      `${config.backendUrl}/matcher/resume-matcher`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`, 
        },
      }
    );

    const data = response.data;
    if (data.error) {
      setError(data.error);
    } else {
      setResults(data);
    }
  } 
  catch (err) {
    console.error("Error analyzing resume:", err);
    const errorMessage = err.response?.data?.error || 'An unexpected error occurred while analyzing the resume.';
    setError(errorMessage);
  } 
  finally {
    setLoading(false);
  }
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
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-500';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200';
    if (score >= 60) return 'bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200';
    return 'bg-gradient-to-br from-red-50 to-red-100 border border-red-200';
  };

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = '#10B981' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${color}40)`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-700">{percentage}%</span>
        </div>
      </div>
    );
  };

  const SkillBar = ({ skill, percentage, isMatching = true }) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{skill}</span>
        <span className="text-sm text-gray-500">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${
            isMatching ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-red-400 to-red-600'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <Award className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              AI Resume Matcher
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Leverage advanced AI to analyze your resume against job descriptions and maximize your hiring potential
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                <FileText className="inline w-6 h-6 mr-2 text-blue-600" />
                Upload Your Resume
              </label>
              <div className="mt-2 flex justify-center px-6 pt-6 pb-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group">
                <div className="space-y-3 text-center">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="resume-upload"
                      className="relative cursor-pointer bg-white rounded-lg px-3 py-2 font-semibold text-blue-600 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <span>Choose file</span>
                      <input
                        id="resume-upload"
                        name="resume-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleResumeUpload}
                      />
                    </label>
                    <p className="pl-2 self-center">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT up to 5MB</p>
                </div>
              </div>
              {resumeFile && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span className="font-medium text-sm">{resumeFile.name}</span>
                    <span className="ml-2 text-xs text-emerald-600">({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="job-description" className="block text-lg font-semibold text-gray-800 mb-4">
                <Briefcase className="inline w-6 h-6 mr-2 text-purple-600" />
                Job Description
              </label>
              <div className="relative">
                <textarea
                  id="job-description"
                  name="job-description"
                  rows={8}
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 resize-none transition-all duration-300"
                  placeholder="Paste the complete job description here... Include requirements, skills, responsibilities, and qualifications for the best analysis."
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {jobDescription.length} characters
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {error && (
              <div className="flex items-center p-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-6 h-6 mr-3" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading || !resumeFile || !jobDescription.trim()}
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    <Zap className="w-5 h-5 mr-2" />
                    Analyzing with AI...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Target className="w-6 h-6 mr-2" />
                    Analyze Match
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-300"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {results && (
          <div className="space-y-8 mb-12">
            <div className={`${getScoreBgColor(results.overall_score)} rounded-2xl p-8 shadow-xl`}>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Overall Match Score</h2>
                <div className="flex justify-center mb-6">
                  <CircularProgress 
                    percentage={results.overall_score} 
                    size={160} 
                    strokeWidth={12}
                    color={results.overall_score >= 80 ? '#10B981' : results.overall_score >= 60 ? '#F59E0B' : '#EF4444'}
                  />
                </div>
                <div className="max-w-md mx-auto">
                  <p className="text-lg text-gray-700 font-medium">
                    {results.overall_score >= 80 ? '🎉 Excellent match! Your resume aligns well with this position.' :
                      results.overall_score >= 60 ? '👍 Good match! Some improvements could boost your chances.' :
                        '💡 Consider updating your resume to better match the requirements.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Skill Match</h3>
                  <CircularProgress 
                    percentage={results.skill_match_score} 
                    size={100} 
                    color="#10B981"
                  />
                  <p className="mt-3 text-sm text-gray-600">How well your skills align</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Content Similarity</h3>
                  <CircularProgress 
                    percentage={results.similarity_score} 
                    size={100} 
                    color="#3B82F6"
                  />
                  <p className="mt-3 text-sm text-gray-600">Overall content alignment</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Skills Gap</h3>
                  <CircularProgress 
                    percentage={100 - results.skill_match_score} 
                    size={100} 
                    color="#F59E0B"
                  />
                  <p className="mt-3 text-sm text-gray-600">Identified skill gap</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {results.matching_skills && results.matching_skills.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    Matching Skills
                    <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      {results.matching_skills.length}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {results.matching_skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      >
                        <span className="font-medium text-emerald-800">{skill}</span>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.missing_skills && results.missing_skills.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                      <XCircle className="w-5 h-5 text-white" />
                    </div>
                    Improvement Areas
                    <span className="ml-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      {results.missing_skills.length}
                    </span>
                  </h3>
                  <p className="text-gray-600 mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    💡 <strong>Pro tip:</strong> Adding these keywords to your resume could significantly improve your match score!
                  </p>
                  <div className="space-y-3">
                    {results.missing_skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                      >
                        <span className="font-medium text-red-800">{skill}</span>
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-10">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">▶</span>
                  </div>
                  Resume Optimization Videos
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">ATS Resume Optimization</h4>
                    <p className="text-sm text-gray-600 mb-3">Learn how to make your resume ATS-friendly</p>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                      <iframe
                        className="w-full h-48 rounded-lg"
                        src="https://www.youtube.com/embed/a43Je1KQY3s?start=2"
                        title="ATS Resume Optimization"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">Keyword Optimization Techniques</h4>
                    <p className="text-sm text-gray-600 mb-3">Master the art of strategic keyword placement</p>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                      <iframe
                        className="w-full h-48 rounded-lg"
                        src="https://www.youtube.com/embed/kV_mC5gCsFQ"
                        title="Keyword Optimization Techniques"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">Resume Format Best Practices</h4>
                    <p className="text-sm text-gray-600 mb-3">Choose the right format for your industry</p>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                      <iframe
                        className="w-full h-48 rounded-lg"
                        src="https://www.youtube.com/embed/V6LgXc3K8CI?start=1"
                        title="Resume Format Best Practices"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  Suggestions
                </h3>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Quantify Your Achievements</h4>
                        <p className="text-sm text-gray-600">Add specific numbers and percentages to make your accomplishments more impactful. Instead of "Improved sales," write "Increased sales by 35% over 6 months."</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-white text-sm">📝</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Use Action Verbs</h4>
                        <p className="text-sm text-gray-600">Start bullet points with strong action verbs like "Implemented," "Optimized," "Developed," or "Streamlined" to show your proactive approach.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-white text-sm">🎯</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Tailor for Each Application</h4>
                        <p className="text-sm text-gray-600">Customize your resume for each job application by emphasizing the most relevant skills and experiences that match the job requirements.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-white text-sm">📊</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Include Relevant Certifications</h4>
                        <p className="text-sm text-gray-600">Highlight industry-relevant certifications, courses, and training programs that demonstrate your commitment to professional development.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">🚀 Next Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">✏️</span>
                  </div>
                  <h4 className="font-semibold mb-2">Update Resume</h4>
                  <p className="text-sm opacity-90">Add missing keywords and skills to improve your match</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="font-semibold mb-2">Tailor Content</h4>
                  <p className="text-sm opacity-90">Customize your experience descriptions to match the role</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h4 className="font-semibold mb-2">Reanalyze</h4>
                  <p className="text-sm opacity-90">Upload your updated resume to see the improved score</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeMatcher;