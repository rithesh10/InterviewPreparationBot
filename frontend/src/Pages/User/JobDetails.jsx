import React, { useState } from "react";
import {
  UploadCloud,
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import axios from "axios";
import config from "../../config/config";
import ResumeUpload from "./ResumeUpload";

const JobDetails = ({ job, onBack }) => {
  const [apply, setApply] = useState(false);
  if (apply) {
    return <ResumeUpload job={job} onBack={() => setApply(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-300"
        >
          <ArrowLeft className="mr-2" /> Back to Job List
        </button>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="bg-blue-600 text-white p-6 rounded-t-xl">
            <h2 className="text-4xl font-extrabold">{job.title}</h2>
            <div className="flex items-center mt-2 space-x-6">
              <div className="flex items-center">
                <Briefcase className="mr-2 text-blue-200" />
                <span className="text-lg">{job.company}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 text-blue-200" />
                <span className="text-lg">{job.location}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-2">
                <Calendar className="text-blue-600" />
                <span className="text-sm text-gray-700">
                  Posted: {new Date(job.posted_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="text-blue-600" />
                <span className="text-sm text-gray-700">
                  Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="text-green-600" />
                <span className="text-sm text-gray-700">Salary: {job.salary_range}</span>
              </div>
            </div>

            <p className="text-gray-800 text-lg mb-6">{job.description}</p>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Skills Required</h3>
              <div className="flex flex-wrap gap-4">
                {job.skills_required.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm transition-transform transform hover:scale-105"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Requirements</h3>
              <ul className="list-disc list-inside text-gray-700">
                {job.requirements.map((req, index) => (
                  <li key={index} className="text-sm">{req}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setApply(true)}
                className="bg-black text-white py-3 px-8 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
