'use client';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function AssistantsList({ courseId, assistants }) {
  const handleRemoveAssistant = (userId) => {
    const updated = assistants.filter(a => a.id !== userId);
    localStorage.setItem(`course-${courseId}-assistants`, JSON.stringify(updated));
    window.location.reload();
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h3 className="text-xl font-semibold mb-4">المساعدون المعينون</h3>
      
      {assistants.length === 0 ? (
        <p className="text-gray-500">لا يوجد مساعدون مضافون حالياً</p>
      ) : (
        <div className="grid gap-3">
          {assistants.map(assistant => (
            <div key={assistant.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">{assistant.name}</p>
                <p className="text-sm text-gray-500">{assistant.email}</p>
              </div>
              <button
                onClick={() => handleRemoveAssistant(assistant.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}