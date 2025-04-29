
// import React, { useState, useEffect } from 'react';
// import { Routes, Route, useLocation } from 'react-router-dom';  // Import Routes and Route here
// import Navbar from '../Pages/User/Navbar';
// import ProtectedRoutes from './ProtectedRoutes';
// import UserDashboard from '../Pages/User/UserDashboard';
// import JobList from '../Pages/User/JobList';

// const UserRoutes = () => {
//   const location = useLocation();
//   const [userId, setUserId] = useState(null);
  
//   // Lock the userId once it gets its value
//   useEffect(() => {
//     if (location.state?.userId && userId === null) {
//       setUserId(location.state.userId);
//       console.log("first" + location.state.userId); // Log the userId once it is set
//     }
//   }, [location.state, userId]); // The effect runs when location.state or userId changes
  
//   return (
//     <>
//       <Navbar />
//       <Routes> {/* Wrap your routes inside Routes */}
//         <Route element={<ProtectedRoutes role="user" />}>
//           <Route path="/" element={<UserDashboard />} />
//           <Route path="jobs" element={<JobList />} />
//         </Route>
//       </Routes>
//     </>
//   );
// };

// export default UserRoutes;
// =======
import React from 'react'
import ProtectedRoutes from './ProtectedRoutes'
import { Route, Routes } from 'react-router-dom'
import UserDashboard from '../Pages/User/UserDashboard'
//import ResumeUpload from '../Pages/User/ResumeUpload'
import JobList from '../Pages/User/JobList'
import Navbar from '../Pages/User/Navbar'
import ThreeStepsComponent from '../Pages/User/ThreeStepsComponent'

import Interview from '../Pages/User/Interview';
import { useAuth } from '../context/AuthContext'
import LearningDashboard from '../Pages/User/LearningDashboard'
import Languages from '../Pages/User/Languages'
import TopicsList from '../Pages/User/Topics'
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
          <Route path="/languages" element={<Languages />} />
          <Route path="/topics/:language" element={<TopicsList />} />
         <Route path="/interview" element={<Interview userId={user?._id} />} /> 
        </Route>
      </Routes>
      </>
    )
  }

  export default UserRoutes
  //        <Route path="upload-resume" element={<ResumeUpload />} />
// >>>>>>> 8efeeafe0dd684b8836059b68370008aa2d49cd3
