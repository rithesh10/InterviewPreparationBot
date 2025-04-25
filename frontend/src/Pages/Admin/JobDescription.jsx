import React, { useEffect, useState } from "react";
import {
  UploadCloud,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  BookmarkIcon,
} from "lucide-react";
import axios from "axios";
import config from "../../config/config";
import { useParams } from "react-router-dom";

const JobDescription = () => {
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.backendUrl}/jobs/job/${id}`, {
        withCredentials: true,
      });

      if (response.status === 404) {
        throw new Error("Failed to fetch job details");
      }

      const data = await response.data.job;
      setJob(data);
    } catch (error) {
      console.error("Error fetching job:", error);
      setMessage("Failed to fetch job details.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderJobHeader = () => (
    <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-8 rounded-t-xl shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-bold mb-3">{job.title}</h2>
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-lg">
              <Briefcase className="mr-2 text-indigo-200" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center text-lg">
              <MapPin className="mr-2 text-indigo-200" />
              <span>{job.location}</span>
            </div>
          </div>
        </div>
        <button className="bg-white/30 hover:bg-white/40 p-3 rounded-full transition-colors shadow-md">
          <BookmarkIcon className="text-white" />
        </button>
      </div>
    </div>
  );

  const renderJobDetails = () => (
    <div className="p-8 space-y-8">
      <div className="grid md:grid-cols-3 gap-8 bg-gray-50 p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          <Calendar className="mr-3 text-indigo-600" />
          <div>
            <span className="text-xs text-gray-500">Posted On</span>
            <p className="font-medium">{new Date(job.posted_date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Calendar className="mr-3 text-indigo-600" />
          <div>
            <span className="text-xs text-gray-500">Application Deadline</span>
            <p className="font-medium">{new Date(job.application_deadline).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <DollarSign className="mr-3 text-green-600" />
          <div>
            <span className="text-xs text-gray-500">Salary Range</span>
            <p className="font-medium">{job.salary_range}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-3 flex items-center space-x-3">
          <CheckCircle2 className="mr-2 text-indigo-600" />
          Job Description
        </h3>
        <p className="text-gray-700 leading-relaxed">{job.description}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-semibold flex items-center space-x-3">
          <CheckCircle2 className="mr-2 text-indigo-600" />
          Skills Required
        </h3>
        <div className="flex flex-wrap gap-4">
          {job.skills_required.map((skill, index) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 hover:bg-indigo-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-semibold flex items-center space-x-3">
          <CheckCircle2 className="mr-2 text-indigo-600" />
          Requirements
        </h3>
        <ul className="space-y-2 text-gray-700">
          {job.requirements.map((req, index) => (
            <li key={index} className="flex items-start space-x-2">
              <CheckCircle2 className="mr-2 mt-1 text-green-500" />
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto my-12 bg-white shadow-xl rounded-xl overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : message ? (
        <div className="text-center text-red-600 p-8">{message}</div>
      ) : job ? (
        <>
          {renderJobHeader()}
          {renderJobDetails()}
        </>
      ) : null}
    </div>
  );
};

export default JobDescription;