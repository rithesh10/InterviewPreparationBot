import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Trash2, Users, Eye, X, CheckCircle, Clock, XCircle, FileText, Mail, Phone, Calendar, Loader } from 'lucide-react';
import axios from 'axios';
import config from '../../config/config';
import { replace } from 'react-router-dom';
import JobList from './JobList'
import JobForm from './JobForm';
// ================= ALERT COMPONENTS =================
const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm mb-6 flex items-start justify-between">
      <div className="flex items-start space-x-3">
        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-red-800 font-semibold text-sm">Error</h3>
          <p className="text-red-700 text-sm mt-1">{message}</p>
        </div>
      </div>
      <button onClick={onClose} className="text-red-500 hover:text-red-700 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm mb-6 flex items-start justify-between">
      <div className="flex items-start space-x-3">
        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-green-800 font-semibold text-sm">Success</h3>
          <p className="text-green-700 text-sm mt-1">{message}</p>
        </div>
      </div>
      <button onClick={onClose} className="text-green-500 hover:text-green-700 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// // ================= JOB LIST COMPONENT =================
// const JobList = ({ jobs, fetchResumes, setSelectedJob, onDeleteJob, isLoading }) => {
//   const getStatusColor = (status) => status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

//   return (
//     <div className="space-y-4">
//       <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
//         <Briefcase className="w-6 h-6 text-blue-600" />
//         <span>Job Listings</span>
//       </h3>

//       {isLoading ? (
//         <div className="flex justify-center items-center py-12">
//           <Loader className="w-8 h-8 text-blue-600 animate-spin" />
//         </div>
//       ) : jobs.length === 0 ? (
//         <div className="text-center py-12 text-gray-500">
//           <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//           <p>No jobs posted yet. Create your first job listing!</p>
//         </div>
//       ) : (
//         <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
//           {jobs.map((job) => (
//             <div key={job._id} className="bg-gradient-to-r from-white to-blue-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
//               <div className="flex justify-between items-start mb-2">
//                 <div className="flex-1">
//                   <h4 className="font-semibold text-gray-800 text-lg">{job.title}</h4>
//                   <p className="text-sm text-gray-600 mt-1">{job.department} • {job.location}</p>
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
//                   {job.status}
//                 </span>
//               </div>
//               <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
//                 <span className="flex items-center space-x-1">
//                   <Users className="w-4 h-4" />
//                   <span>{job.applicants || 0} applicants</span>
//                 </span>
//                 <span className="flex items-center space-x-1">
//                   <Calendar className="w-4 h-4" />
//                   <span>{new Date(job.postedDate).toLocaleDateString()}</span>
//                 </span>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => {
//                     setSelectedJob(job);
//                     fetchResumes(job._id);
//                   }}
//                   className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
//                 >
//                   <Eye className="w-4 h-4" />
//                   <span>View Resumes</span>
//                 </button>
//                 <button
//                   onClick={() => onDeleteJob(job._id)}
//                   className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// ================= JOB FORM COMPONENT =================
// const JobForm = ({ fetchJobs, setError, setSuccess }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     department: '',
//     location: '',
//     description: '',
//     requirements: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.title || !formData.department || !formData.location) {
//       setError('Please fill in all required fields');
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const response = await axios.post(`${config.backendUrl}/jobs/jobs`, formData, {
//         headers: { Authorization: `Bearer ${accessToken}` }
//       });
//       setSuccess('Job listing created successfully!');
//       setFormData({ title: '', department: '', location: '', description: '', requirements: '' });
//       fetchJobs();
//     } catch (err) {
//       setError('Failed to create job listing. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   return (
//     <div className="space-y-4">
//       <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
//         <Plus className="w-6 h-6 text-blue-600" />
//         <span>Create New Job</span>
//       </h3>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
//           <input type="text" name="title" value={formData.title} onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             placeholder="e.g., Senior Software Engineer" />
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
//             <input type="text" name="department" value={formData.department} onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g., Engineering" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
//             <input type="text" name="location" value={formData.location} onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g., Remote" />
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea name="description" value={formData.description} onChange={handleChange} rows="3"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
//             placeholder="Describe the role and responsibilities..." />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
//           <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows="3"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
//             placeholder="List the required skills and qualifications..." />
//         </div>
//         <button type="button" onClick={handleSubmit} disabled={isSubmitting}
//           className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
//           {isSubmitting ? <><Loader className="w-5 h-5 animate-spin" /><span>Creating...</span></> :
//             <><Plus className="w-5 h-5" /><span>Create Job Listing</span></>}
//         </button>
//       </div>
//     </div>
//   );
// };

// ================= RESUME LIST COMPONENT =================
const ResumeList = ({ resumes, jobTitle, isLoading }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      under_review: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Under Review' },
      shortlisted: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Shortlisted' },
      interview: { color: 'bg-blue-100 text-blue-800', icon: Users, label: 'Interview' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' }
    };
    const config = statusConfig[status] || statusConfig.under_review;
    const Icon = config.icon;
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${config.color}`}><Icon className="w-3 h-3" />{config.label}</span>;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
        <FileText className="w-6 h-6 text-blue-600" />
        <span>Resumes for: {jobTitle}</span>
      </h3>
      {isLoading ? (
        <div className="flex justify-center items-center py-12"><Loader className="w-8 h-8 text-blue-600 animate-spin" /></div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No resumes submitted yet for this position.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {resumes.map(resume => (
            <div key={resume._id} className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">{resume.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{resume.experience} experience</p>
                </div>
                {getStatusBadge(resume.status)}
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600"><Mail className="w-4 h-4 text-gray-400" /><span>{resume.email}</span></div>
                <div className="flex items-center space-x-2 text-sm text-gray-600"><Phone className="w-4 h-4 text-gray-400" /><span>{resume.phone}</span></div>
                <div className="flex items-center space-x-2 text-sm text-gray-600"><Calendar className="w-4 h-4 text-gray-400" /><span>Applied on {new Date(resume.appliedDate).toLocaleDateString()}</span></div>
              </div>
              <button className="w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center space-x-2">
                <FileText className="w-4 h-4" /><span>View Resume</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ================= MAIN ADMIN DASHBOARD =================
const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);

  useEffect(() => { fetchJobs(); }, []);
  useEffect(() => { if(error){ const t=setTimeout(()=>setError(null),5000); return()=>clearTimeout(t); } }, [error]);
  useEffect(() => { if(success){ const t=setTimeout(()=>setSuccess(null),5000); return()=>clearTimeout(t); } }, [success]);

  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${config.backendUrl}/jobs/jobs`, { headers: { Authorization: `Bearer ${accessToken}` } });
      setJobs(response.data.jobs || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch job listings. Please try again.');
    } finally { setIsLoadingJobs(false); }
  };

  const fetchResumes = async (jobId) => {
    setIsLoadingResumes(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${config.backendUrl}/resume/get-resume-jobId/${jobId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
      setResumes(response.data.resumes || []);
      console.log(resumes)
      setError(null);
    } catch (err) {
      setError('Failed to fetch resumes. Please try again.');
    } finally { setIsLoadingResumes(false); }
  };

  const handleDeleteJob = async (jobId) => {
    if(!window.confirm('Are you sure you want to delete this job listing?')) return;
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`${config.backendUrl}/jobs/delete/${jobId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
      setSuccess('Job listing deleted successfully!');
      fetchJobs();
      if(selectedJob?.id === jobId){ setSelectedJob(null); setResumes([]); }
    } catch(err) { setError('Failed to delete job listing. Please try again.'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg"><Briefcase className="text-white w-10 h-10" /></div>
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Admin Dashboard</span>
          </h1>
          <p className="text-gray-600 text-lg ml-20">Manage job listings and track applicants</p>
        </div>
        <ErrorAlert message={error} onClose={()=>setError(null)} />
        <SuccessAlert message={success} onClose={()=>setSuccess(null)} />
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <JobList jobs={jobs} fetchResumes={fetchResumes} setSelectedJob={setSelectedJob} onDeleteJob={handleDeleteJob} isLoading={isLoadingJobs} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <JobForm fetchJobs={fetchJobs} setError={setError} setSuccess={setSuccess} />
          </div>
        </div>
        {selectedJob && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <ResumeList resumes={resumes} jobTitle={selectedJob.title} isLoading={isLoadingResumes} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
