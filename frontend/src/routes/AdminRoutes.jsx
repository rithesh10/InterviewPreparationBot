import React from 'react'
import ProtectedRoutes from './ProtectedRoutes'
import {Routes,Route} from 'react-router-dom'
import AdminDashboard from '../Pages/Admin/AdminDashboard'
import Resumes from '../Pages/Admin/Resume'
import AdminNavbar from '../Pages/Admin/AdminNavbar'
import ResumeList from '../Pages/Admin/ResumeList'
import ResumeRankings from '../Pages/Admin/ResumeRankings'
import JobDescription from '../Pages/Admin/JobDescription'
import JobList from '../Pages/Admin/JobList'
const AdminRoutes = () => {
  return (
    <div>
      <AdminNavbar/>
            <Routes>
              <Route element={<ProtectedRoutes role="admin" />}>
                <Route  path='/' element={<AdminDashboard/>}/>
                <Route path='resumes/:id' element={<ResumeList/>}/>
                <Route path='resumes/resume/:id' element={<Resumes/>}/>
                <Route path='resume-rankings/:job_id' element={<ResumeRankings/>}/>
                {/* <Route path="jobs" element={<JobList/>}/> */}
                <Route path='job/:id' element={<JobDescription/>}/>
              </Route>
            </Routes>
    </div>
  )
}

export default AdminRoutes