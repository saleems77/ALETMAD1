// في ملف الصفحة page.jsx
import { Suspense } from 'react';
import MultiChannelCenterDashboard from './MultiChannelCenterDashboard'
export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MultiChannelCenterDashboard />
    </Suspense>
  );
}