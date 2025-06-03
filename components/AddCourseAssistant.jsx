'use client';
import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/react/24/outline';

export default function AddCourseAssistant({ courseId, currentAssistants }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // بيانات مستخدمين وهمية (ستستبدل بAPI لاحقاً)
  const mockUsers = [
    { id: 1, name: 'أحمد محمد', role: 'مساعد', email: 'ahmed@example.com' },
    { id: 2, name: 'فاطمة علي', role: 'مدرب', email: 'fatima@example.com' }
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !currentAssistants.some(a => a.id === user.id)
      );
      setSearchResults(filtered);
    }
  }, [searchQuery]);

  const handleAddAssistant = () => {
    if (!selectedUser) return;
    
    // هنا سيتم إرسال الطلب للخادم لاحقاً
    const assistants = JSON.parse(localStorage.getItem(`course-${courseId}-assistants`) || '[]');
    localStorage.setItem(`course-${courseId}-assistants`, JSON.stringify([...assistants, selectedUser]));
    
    setSearchQuery('');
    setSelectedUser(null);
    window.location.reload(); // تحديث القائمة
  };

  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-xl">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <UserPlusIcon className="w-6 h-6" />
        إضافة مساعد جديد
      </h3>

      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ابحث بالاسم أو البريد..."
            className="flex-1 p-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleAddAssistant}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={!selectedUser}
          >
            إضافة
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
            {searchResults.map(user => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-3 cursor-pointer hover:bg-gray-100 ${
                  selectedUser?.id === user.id ? 'bg-blue-50' : ''
                }`}
              >
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}