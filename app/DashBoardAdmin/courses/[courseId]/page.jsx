export default function AdminCourseAssistants({ params }) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">إدارة مساعدي الدورة #{params.courseId}</h1>
        <AddAssistantModal 
          courseId={params.courseId} 
          userRole="admin" 
        />
        <AssistantsTable 
          courseId={params.courseId}
          editable={true}
        />
      </div>
    );
  }