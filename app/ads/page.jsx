"use client"
import React from 'react'
import AdminAdsPage from './SocialMediaManager'
import ProtectedRoute from '../DashBoardAdmin/components/ProtectedRoute';

function page() {
  return (
    <ProtectedRoute>
    <div>
      <AdminAdsPage/>
    </div>
    </ProtectedRoute>
  )
}
export default page;