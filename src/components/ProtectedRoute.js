import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

const ProtectedRoute = ({children}) => {
    const {user} = UserAuth();
    if (!user) {
        return <Navigate to="/signin" />
    }
  return children;
}

export default ProtectedRoute