import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext' // Ensure useAuth is set up correctly

const ProtectedRoutes = ({ role }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/not-authorized" replace />
  }

  return <Outlet /> // This renders nested routes
}

export default ProtectedRoutes
