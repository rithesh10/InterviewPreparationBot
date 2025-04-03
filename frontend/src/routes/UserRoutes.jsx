import React from 'react'
import ProtectedRoutes from './ProtectedRoutes'
import { Route, Routes } from 'react-router-dom'
import UserDashboard from '../Pages/User/UserDashboard'
import ResumeUpload from '../Pages/User/ResumeUpload'
import JobList from '../Pages/User/JobList'
import Navbar from '../Pages/User/Navbar'

const UserRoutes = () => {
  return (
    <>
    <Navbar/>
    
    <Routes>
      <Route element={<ProtectedRoutes role="user" />}>
        <Route path="/" element={<UserDashboard />} />
        <Route path="upload-resume" element={<ResumeUpload />} />
        <Route path="jobs" element={<JobList />} />
      </Route>
    </Routes>
    </>
  )
}

export default UserRoutes
