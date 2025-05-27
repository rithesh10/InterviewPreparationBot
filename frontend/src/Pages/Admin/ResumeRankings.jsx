import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Filter, Star, ArrowUp, Trash2 } from "lucide-react";
import {useParams} from 'react-router-dom'
import config from "../../config/config";

// import "./ResumeRankings.css";

const ResumeRankings = () => {
    const {job_id} = useParams(); 
    const [rankings, setRankings] = useState([]);
    const [topResumes, setTopResumes] = useState([]);
    const [matchingResumes, setMatchingResumes] = useState([]);
    const [skills, setSkills] = useState("");
    const [newRanking, setNewRanking] = useState({ resume_id: "", job_id });
    const [topN, setTopN] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("rankings");

    useEffect(() => {
        fetchRankings();
    }, [job_id]);


    const fetchRankings = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${config.backendUrl}/ranking/all-resume-rankings/${job_id}`);
            setRankings(response.data);
        } catch (error) {
            console.error("Error fetching rankings:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const fetchTopNResumes = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${config.backendUrl}/ranking/resume-rankings/top/${topN}`);
            setTopResumes(response.data);
        } catch (error) {
            console.error("Error fetching top resumes:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const fetchMatchingResumes = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${config.backendUrl}/ranking/resume-rankings/match-skills`, {
                skills: skills.split(",").map(skill => skill.trim())
            });
            setMatchingResumes(response.data);
        } catch (error) {
            console.error("Error fetching resumes by skills:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const deleteRanking = async (id) => {
        try {
            await axios.delete(`${config.backendUrl}/resume/resume-rankings/${id}`);
            fetchRankings(); 
        } catch (error) {
            console.error("Error deleting ranking:", error);
        }
    };
    
    const addRanking = async () => {
        try {
            await axios.post(`${config.backendUrl}/resume/resume-rankings`, newRanking, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            fetchRankings();
            setNewRanking({ resume_id: "", job_id });
        } catch (error) {
            console.error("Error adding ranking:", error);
        }
    };
    
    const updateRanking = async (id, updates) => {
        try {
            await axios.put(`${config.backendUrl}/resume/resume-rankings/${id}`, updates, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            fetchRankings();
        } catch (error) {
            console.error("Error updating ranking:", error);
        }
    };
    
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="bg-white shadow-md rounded-lg">
                <div className="p-4 border-b flex items-center">
                    <Star className="mr-2 text-yellow-500" />
                </div>
                
                <div className="flex border-b">
                    {['rankings', 'top-resumes', 'skill-match'].map(tab => (
                        <button
                            key={tab}
                            className={`px-4 py-2 ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </button>
                    ))}
                </div>

                {activeTab === 'rankings' && (
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100 border-b">
                                        <th className="p-3 text-left">Resume ID</th>
                                        <th className="p-3 text-left">AI Score</th>
                                        <th className="p-3 text-left">Matching Skills</th>
                                        <th className="p-3 text-left">Missing Skills</th>
                                        <th className="p-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rankings.map((ranking) => (
                                        <tr key={ranking._id} className="border-b hover:bg-gray-50">
                                            <td className="p-3">{ranking.resume_id}</td>
                                            <td className="p-3">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {ranking.ai_score}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {ranking.matching_skills.map(skill => (
                                                    <span key={skill} className="bg-green-100 text-green-800 px-2 py-1 rounded mr-1">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="p-3">
                                                {ranking.missing_skills.map(skill => (
                                                    <span key={skill} className="bg-red-100 text-red-800 px-2 py-1 rounded mr-1">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="p-3 flex space-x-2">
                                                <button 
                                                    className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
                                                    onClick={() => updateRanking(ranking._id, { ai_score: ranking.ai_score + 1 })}
                                                >
                                                    <ArrowUp className="h-4 w-4 mr-1" /> Update
                                                </button>
                                                <button 
                                                    className="bg-red-500 text-white px-3 py-1 rounded flex items-center"
                                                    onClick={() => deleteRanking(ranking._id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'top-resumes' && (
                    <div className="p-4">
                        <div className="flex mb-4 space-x-2">
                            <input 
                                type="number" 
                                placeholder="Number of Top Resumes" 
                                value={topN}
                                onChange={(e) => setTopN(Number(e.target.value))}
                                className="border p-2 rounded w-1/4"
                            />
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                                onClick={fetchTopNResumes}
                            >
                                <Filter className="h-4 w-4 mr-2" /> Fetch Top Resumes
                            </button>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="p-3 text-left">Resume ID</th>
                                    <th className="p-3 text-left">AI Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topResumes.map((resume) => (
                                    <tr key={resume._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{resume.resume_id}</td>
                                        <td className="p-3">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {resume.ai_score}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'skill-match' && (
                    <div className="p-4">
                        <div className="flex mb-4 space-x-2">
                            <input 
                                type="text" 
                                placeholder="Enter skills (comma-separated)" 
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                            <button 
                                className="bg-purple-500 text-white px-4 py-2 rounded flex items-center"
                                onClick={fetchMatchingResumes}
                            >
                                <Filter className="h-4 w-4 mr-2" /> Find Matching Resumes
                            </button>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="p-3 text-left">Resume ID</th>
                                    <th className="p-3 text-left">Matching Skills</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matchingResumes.map((resume) => (
                                    <tr key={resume._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{resume.resume_id}</td>
                                        <td className="p-3">
                                            {resume.matching_skills.map(skill => (
                                                <span key={skill} className="bg-green-100 text-green-800 px-2 py-1 rounded mr-1">
                                                    {skill}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="p-4 border-t">
                    <h3 className="text-lg font-semibold mb-2">Add New Ranking</h3>
                    <div className="flex space-x-2">
                        <input 
                            type="text"
                            placeholder="Resume ID"
                            value={newRanking.resume_id}
                            onChange={(e) => setNewRanking({ ...newRanking, resume_id: e.target.value })}
                            className="border p-2 rounded w-full"
                        />
                        <button 
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            onClick={addRanking}
                        >
                            Add Ranking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeRankings;