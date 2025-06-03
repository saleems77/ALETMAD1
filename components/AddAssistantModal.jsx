'use client';
import { useState } from 'react';

export default function AddAssistantModal({ courseId, userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
    const results = await searchUsers(query, { excludeExistingAssistants: courseId });
    setSearchResults(results);
  };

  return (
    <div className="mb-6">
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        + إضافة مساعد
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">إضافة مساعد جديد</h3>
            <input
              type="text"
              placeholder="ابحث بالاسم أو البريد..."
              className="w-full p-2 border rounded mb-4"
              onChange={(e) => handleSearch(e.target.value)}
            />
            
            <div className="max-h-60 overflow-y-auto">
              {searchResults.map(user => (
                <div key={user.id} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <p>{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button 
                    className="px-3 py-1 bg-green-100 text-green-800 rounded"
                    onClick={() => {/* دالة الإضافة */}}
                  >
                    تعيين
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}