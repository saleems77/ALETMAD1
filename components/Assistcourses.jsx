import AddAssistantModal from "@/components/AddAssistantModal";
import AssistantsTable from "@/components/AssistantsTable";
export default function TrainerAssistants({ params }) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">مساعدو دورتي</h1>
        <AddAssistantModal 
          courseId={params.courseId}
          userRole="trainer"
        />
        <AssistantsTable 
          courseId={params.courseId}
          editable={true}
        />
      </div>
    );
  }