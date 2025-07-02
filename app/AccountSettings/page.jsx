//AccountSettings/page.jsx
"use client";
import AccountSettings from './AccountSettings'
import ProtectedRoute from '../DashBoardAdmin/components/ProtectedRoute';

function page() {
  return (
    <ProtectedRoute>
      <AccountSettings/>
    </ProtectedRoute>
  )
}

export default page
