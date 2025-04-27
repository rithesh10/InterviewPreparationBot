<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';  // Import Routes and Route here
import Navbar from '../Pages/User/Navbar';
import ProtectedRoutes from './ProtectedRoutes';
import UserDashboard from '../Pages/User/UserDashboard';
import JobList from '../Pages/User/JobList';
import Interview from '../Pages/User/Interview';

const UserRoutes = () => {
  const location = useLocation();
  const [userId, setUserId] = useState(null);

  // Lock the userId once it gets its value
  useEffect(() => {
    if (location.state?.userId && userId === null) {
      setUserId(location.state.userId);
      console.log("first" + location.state.userId); // Log the userId once it is set
    }
  }, [location.state, userId]); // The effect runs when location.state or userId changes

  return (
    <>
      <Navbar />
      <Routes> {/* Wrap your routes inside Routes */}
        <Route element={<ProtectedRoutes role="user" />}>
          <Route path="/" element={<UserDashboard />} />
          <Route path="interview" element={<Interview userId={userId} />} />
          <Route path="jobs" element={<JobList />} />
        </Route>
      </Routes>
    </>
  );
};

export default UserRoutes;
=======
  import React from 'react'
  import ProtectedRoutes from './ProtectedRoutes'
  import { Route, Routes } from 'react-router-dom'
  import UserDashboard from '../Pages/User/UserDashboard'
  //import ResumeUpload from '../Pages/User/ResumeUpload'
  import JobList from '../Pages/User/JobList'
  import Navbar from '../Pages/User/Navbar'
  import ThreeStepsComponent from '../Pages/User/ThreeStepsComponent'

  const UserRoutes = () => {
    return (
      <>
      <Navbar/>
      
      <Routes>
        <Route element={<ProtectedRoutes role="user" />}>
          <Route path="/" element={<UserDashboard />} />
          <Route path="jobs" element={<JobList />} />
          <Route path="/three-steps" element={<ThreeStepsComponent />} />
        </Route>
      </Routes>
      </>
    )
  }

  export default UserRoutes
  //        <Route path="upload-resume" element={<ResumeUpload />} />
>>>>>>> 8efeeafe0dd684b8836059b68370008aa2d49cd3
