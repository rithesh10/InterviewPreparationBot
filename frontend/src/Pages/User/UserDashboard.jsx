import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Bell, 
  Briefcase, 
  FileText, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock 
} from 'lucide-react';

// Mock data - in a real application, these would come from API calls
const mockJobApplications = [
  {
    id: 1,
    company: 'TechCorp Solutions',
    position: 'Senior Software Engineer',
    status: 'Applied',
    dateApplied: '2024-03-20',
    applicationProgress: [
      { stage: 'Application Submitted', completed: true, date: '2024-03-20' },
      { stage: 'Resume Review', completed: false, date: null },
      { stage: 'Initial Interview', completed: false, date: null },
      { stage: 'Technical Interview', completed: false, date: null },
      { stage: 'Final Interview', completed: false, date: null }
    ]
  },
  {
    id: 2,
    company: 'InnovateX',
    position: 'Product Manager',
    status: 'Interview',
    dateApplied: '2024-03-15',
    applicationProgress: [
      { stage: 'Application Submitted', completed: true, date: '2024-03-15' },
      { stage: 'Resume Review', completed: true, date: '2024-03-18' },
      { stage: 'Initial Interview', completed: true, date: '2024-03-22' },
      { stage: 'Technical Interview', completed: false, date: null },
      { stage: 'Final Interview', completed: false, date: null }
    ]
  }
];

const mockNotifications = [
  {
    id: 1,
    type: 'application_update',
    message: 'Your application for Senior Software Engineer at TechCorp Solutions is under review',
    date: '2024-03-25',
    read: false
  },
  {
    id: 2,
    type: 'interview_invite',
    message: 'You have been invited for an initial interview at InnovateX',
    date: '2024-03-22',
    read: false
  }
];

const mockRecommendedJobs = [
  {
    id: 1,
    title: 'Full Stack Developer',
    company: 'StartUp Innovations',
    location: 'Remote',
    salary: '$120,000 - $150,000'
  },
  {
    id: 2,
    title: 'DevOps Engineer',
    company: 'CloudTech Systems',
    location: 'San Francisco, CA',
    salary: '$130,000 - $160,000'
  }
];

const UserDashboard = () => {
  const {user} = useAuth()
  const [jobApplications, setJobApplications] = useState(mockJobApplications);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [recommendedJobs, setRecommendedJobs] = useState(mockRecommendedJobs);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Applied': return <Clock className="text-yellow-500" />;
      case 'Interview': return <CheckCircle className="text-green-500" />;
      case 'Rejected': return <XCircle className="text-red-500" />;
      default: return null;
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <User className="w-16 h-16 text-blue-500 mr-4" />
            <div>
              <h2 className="text-xl font-bold">{user.full_name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span>Profile Completeness</span>
              {/* <span>{user.profileCompleteness}%</span> */}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{width: `${user.profileCompleteness}%`}}
              ></div>
            </div>
          </div>
          
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Complete Profile
          </button>
        </div>

        {/* Job Applications */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Briefcase className="w-6 h-6 mr-2 text-blue-500" />
            <h3 className="text-lg font-semibold">My Applications</h3>
          </div>
          
          {jobApplications.map(application => (
            <div key={application.id} className="mb-4 border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{application.position}</h4>
                  <p className="text-gray-500">{application.company}</p>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(application.status)}
                  <span className="ml-2">{application.status}</span>
                </div>
              </div>
              <div className="mt-2">
                {application.applicationProgress.map((stage, index) => (
                  <div 
                    key={index} 
                    className={`h-1 ${stage.completed ? 'bg-green-500' : 'bg-gray-300'} inline-block mr-1 w-16`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Notifications & Recommended Jobs */}
        <div>
          {/* Notifications */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Bell className="w-6 h-6 mr-2 text-blue-500" />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 mb-2 rounded ${!notification.read ? 'bg-blue-50' : 'bg-gray-100'} flex justify-between items-center`}
              >
                <div>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.date}</p>
                </div>
                {!notification.read && (
                  <button 
                    onClick={() => markNotificationAsRead(notification.id)}
                    className="text-blue-500 text-sm"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Recommended Jobs */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Search className="w-6 h-6 mr-2 text-blue-500" />
              <h3 className="text-lg font-semibold">Recommended Jobs</h3>
            </div>
            
            {recommendedJobs.map(job => (
              <div key={job.id} className="mb-4 border-b pb-4">
                <h4 className="font-medium">{job.title}</h4>
                <p className="text-gray-500">{job.company}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-green-600">{job.location}</span>
                  <span className="text-sm font-bold">{job.salary}</span>
                </div>
                <button className="mt-2 w-full bg-green-500 text-white py-1 rounded hover:bg-green-600">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;