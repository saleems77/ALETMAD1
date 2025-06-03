'use client';
import { useState } from 'react';

export default function AssistantsTable({ courseId, editable }) {
  const [assistants, setAssistants] = useState([]);

  useEffect(() => {
    const loadAssistants = async () => {
      const res = await fetch(`/api/courses/${courseId}/assistants`);
      setAssistants(await res.json());
    };
    loadAssistants();
  }, [courseId]);

  const handleRemove = async (userId) => {
    await removeAssistant(courseId, userId);
    setAssistants(assistants.filter(a => a.id !== userId));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-right">الاسم</th>
            <th className="p-3 text-right">البريد</th>
            {editable && <th className="p-3 text-right">إجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {assistants.map(assistant => (
            <tr key={assistant.id} className="border-b">
              <td className="p-3">{assistant.name}</td>
              <td className="p-3">{assistant.email}</td>
              {editable && (
                <td className="p-3">
                  <button
                    onClick={() => handleRemove(assistant.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    إزالة
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}