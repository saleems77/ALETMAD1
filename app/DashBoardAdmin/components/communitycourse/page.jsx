// app/DashBoaredAdmin/components/communitycourse/page.jsx
"use client";
import { Suspense } from 'react'; // ← استيراد Suspense
import CommunityDashboard from "./CommunityDashboard";

export default function CommunityCoursePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}> {/* ← إضافة Suspense */}
      <CommunityDashboard />
    </Suspense>
  );
}