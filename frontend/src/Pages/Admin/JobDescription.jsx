import React, { useEffect, useState } from "react";
import {
  UploadCloud,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  BookmarkIcon
} from "lucide-react";
import axios from "axios";
import config from "../../config/config";
import { useParams } from "react-router-dom";
const JobDescription = () => {
    const [job, setJob] = useState(null);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {id} =useParams()
    // Simulated job ID - replace with actual retrieval method
    // const id = "job_123"; 

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${config.backendUrl}/jobs/job/${id}`, {
               withCredentials:true
            });
            
            if (response.status===404) {
                throw new Error('Failed to fetch job details');
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
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold mb-3">{job.title}</h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <Briefcase className="mr-2 text-indigo-200" />
                            <span className="font-medium">{job.company}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="mr-2 text-indigo-200" />
                            <span>{job.location}</span>
                        </div>
                    </div>
                </div>
                <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                    <BookmarkIcon className="text-white" />
                </button>
            </div>
        </div>
    );

    const renderJobDetails = () => (
        <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                    <Calendar className="mr-2 text-indigo-600" />
                    <div>
                        <span className="text-xs text-gray-500">Posted On</span>
                        <p className="font-medium">{new Date(job.posted_date).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Calendar className="mr-2 text-indigo-600" />
                    <div>
                        <span className="text-xs text-gray-500">Application Deadline</span>
                        <p className="font-medium">{new Date(job.application_deadline).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <DollarSign className="mr-2 text-green-600" />
                    <div>
                        <span className="text-xs text-gray-500">Salary Range</span>
                        <p className="font-medium">{job.salary_range}</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <CheckCircle2 className="mr-2 text-indigo-600" />
                    Job Description
                </h3>
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            <div className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center">
                    <CheckCircle2 className="mr-2 text-indigo-600" />
                    Skills Required
                </h3>
                <div className="flex flex-wrap gap-2">
                    {job.skills_required.map((skill, index) => (
                        <span 
                            key={index} 
                            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center">
                    <CheckCircle2 className="mr-2 text-indigo-600" />
                    Requirements
                </h3>
                <ul className="space-y-2 text-gray-700">
                    {job.requirements.map((req, index) => (
                        <li 
                            key={index} 
                            className="flex items-start"
                        >
                            <CheckCircle2 className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                            {req}
                        </li>
                    ))}
                </ul>
            </div>

           
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto my-8 bg-white shadow-2xl rounded-xl overflow-hidden">
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : message ? (
                <div className="text-center text-red-600 p-6">{message}</div>
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