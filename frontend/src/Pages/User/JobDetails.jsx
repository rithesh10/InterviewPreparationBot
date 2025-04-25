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
if(apply)
{
    return <ResumeUpload job={job} onBack={()=>setApply(false)} />
}
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeft className="mr-2" /> Back to Job List
        </button>

        <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-3xl font-bold">{job.title}</h2>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                <Briefcase className="mr-2 text-blue-200" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 text-blue-200" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="mr-2 text-blue-600" />
                <span>Posted: {new Date(job.posted_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 text-blue-600" />
                <span>Deadline: {new Date(job.application_deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 text-green-600" />
                <span>Salary: {job.salary_range}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{job.description}</p>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills_required.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Requirements</h3>
              <ul className="list-disc list-inside text-gray-700">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
            <div className="m-6">
               <button className="text-white bg-black py-2 px-4 rounded-md" onClick={()=>setApply(true)}>Apply</button>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
