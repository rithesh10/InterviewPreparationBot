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