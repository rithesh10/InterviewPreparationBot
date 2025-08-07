import React from 'react'
import ProtectedRoutes from './ProtectedRoutes'
import { Route, Routes } from 'react-router-dom'
import UserDashboard from '../Pages/User/UserDashboard'
//import ResumeUpload from '../Pages/User/ResumeUpload'
import JobList from '../Pages/User/JobList'
import Navbar from '../Pages/User/Navbar'
import ThreeStepsComponent from '../Pages/User/ThreeStepsComponent'

import Interview from '../Pages/User/Interview';
import PerformanceMain from '../Pages/User/PerformanceMain';
import { useAuth } from '../context/AuthContext'
import LearningDashboard from '../Pages/User/LearningDashboard'
import Languages from '../Pages/User/Languages'
import TopicsList from '../Pages/User/Topics'
import Resumematcher from '../Pages/User/Resumematcher'
const UserRoutes = () => {
  const {user}=useAuth()
  // console.log(user)
  return (
    <>
      <Navbar/>
      
      <Routes>
        <Route element={<ProtectedRoutes role="user" />}>
          <Route path="/" element={<UserDashboard />} />
          <Route path="jobs" element={<JobList />} />
          <Route path="/three-steps" element={<ThreeStepsComponent />} />
          <Route path="/learning" element={<LearningDashboard />} />
          <Route path="/Resumematcher" element={<Resumematcher />} />
          <Route path="/languages" element={<Languages />} />
          <Route path="/topics/:language" element={<TopicsList />} />
          <Route path="/interview" element={<Interview userId={user?._id} />} /> 
          <Route path="interview" element={<Interview userId={user?._id} />} /> 
          <Route path="performance" element={<PerformanceMain userId={user?._id} />} /> 
          <Route path="performance" element={<Performance userId={user?._id} />} /> 
        </Route>
      </Routes>
      </>
    )
  }

  export default UserRoutes