import React, { useState } from "react";
import {
  UploadCloud,
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import ResumeUpload from "./ResumeUpload";

const JobDetails = ({ job, onBack }) => {
  const [apply, setApply] = useState(false);

  if (apply) {
    return <ResumeUpload job={job} onBack={() => setApply(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black p-6 text-gray-100 font-serif">
      <div className="container mx-auto max-w-5xl">
        <button
          onClick={onBack}
          className="flex items-center text-yellow-500 hover:text-yellow-300 mb-6 transition duration-200"
        >
          <ArrowLeft className="mr-2" /> Return to Ravens
        </button>

        <div className="border border-yellow-800 bg-[url('/parchment-texture.jpg')] bg-cover bg-center shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-800/90 to-red-900/80 backdrop-blur p-8 text-white rounded-t-3xl">
            <h2 className="text-4xl font-bold tracking-wider">{job.title}</h2>
            <div className="flex items-center mt-3 space-x-6 text-sm">
              <div className="flex items-center">
                <Briefcase className="mr-2 text-yellow-300" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 text-yellow-300" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          <div className="p-8 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-700 scrollbar-track-yellow-900">
            <div className="grid md:grid-cols-2 gap-6 mb-8 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-2 text-yellow-400" />
                <span>Date of the Raven: {new Date(job.posted_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 text-yellow-400" />
                <span>Last Date to Swear Oath: {new Date(job.application_deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 text-green-400" />
                <span>Gold Promised: {job.salary_range}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl text-yellow-400 font-semibold border-b border-yellow-700 pb-2 mb-3">Scroll Details</h3>
              <p className="text-gray-200 leading-relaxed">{job.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl text-yellow-400 font-semibold border-b border-yellow-700 pb-2 mb-3">Skills of the Realm</h3>
              <div className="flex flex-wrap gap-3">
                {job.skills_required.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-red-900 text-yellow-200 px-4 py-1 rounded-full text-sm border border-yellow-600 shadow-inner"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl text-yellow-400 font-semibold border-b border-yellow-700 pb-2 mb-3">Oath Requirements</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <button
                className="bg-gradient-to-br from-red-700 via-red-800 to-yellow-700 text-white px-8 py-3 rounded-xl text-lg font-medium tracking-wide shadow-md border border-yellow-600 hover:scale-105 hover:shadow-2xl transition"
                onClick={() => setApply(true)}
              >
                Swear the Oath
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
