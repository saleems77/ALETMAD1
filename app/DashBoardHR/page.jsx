// app/dashboard/agent/page.jsx
"use client";
import React, { useState } from "react"; // <-- يجب استيراد useState
import Sidebar from './components/Sidebar'; // <-- تصحيح اسم المكون
import AssistantDashboard from './components/AssistantDashboard';
import TaskList from './components/TaskList';
import CourseManagement from './components/CourseManagement';
import SupportInbox from './components/SupportInbox';
import StudentTracking from './components/StudentTracking';
import ProfileSettings from './components/ProfileSettings';
import UsersPage from './components/managmentTeam/page';

function Page() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sections={{
      
          
        }}
      />
      <main className="flex-1 mr-64 p-8"> {/* تصحيح الهوامش */}
      <div className="bg-white  p-6 rounded-lg shadow-sm"> {/* إضافة h-full */}
      {activeSection === 'dashboard' && <AssistantDashboard />}
      {activeSection === 'tasks' && <TaskList />}
      {activeSection === 'course' && <CourseManagement />}
      {activeSection === 'support' && <SupportInbox />}
      {activeSection === 'student' && <StudentTracking />}
      {activeSection === 'settings' && <ProfileSettings />}
      {activeSection === 'Employee' && <UsersPage />}
     
        </div>
      </main>
    </div>
  );
}

export default Page;