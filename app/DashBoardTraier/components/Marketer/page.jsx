"use client"
import React from 'react'
import ProtectedRoute from '../../../DashBoardAdmin/components/ProtectedRoute';
import MarketersSystem from './MarketersSystem';

function page() {
  return (
     <ProtectedRoute>
    <MarketersSystem />
  </ProtectedRoute>
  )
}

export default page
