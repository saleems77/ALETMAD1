"use client"
import ProtectedRoute from './ProtectedRoute';
import dynamic from 'next/dynamic';

const TeamManagementPanel = dynamic(() => import('./TeamManagementPanel'), {
  ssr: false, // هذا يعني أنه سيتم تحميله فقط في العميل
});
export default function UsersPage() {
  return (
    <ProtectedRoute >
      <div className="min-h-screen bg-gray-50 p-8">
        <TeamManagementPanel />
      </div>
    </ProtectedRoute>
  );
}