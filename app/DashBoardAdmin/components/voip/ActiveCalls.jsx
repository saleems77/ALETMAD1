// components/ActiveCalls.jsx
"use client"
import { useState, useEffect } from 'react';
import { Call, Phone, User } from 'lucide-react';

const ActiveCalls = () => {
  const [calls, setCalls] = useState([]);

  // جلب بيانات المكالمات الوهمية (استبدالها بـ API حقيقي لاحقًا)
  useEffect(() => {
    fetch('/api/active-calls')
      .then(res => res.json())
      .then(data => setCalls(data));
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
        <Phone className="text-blue-500" /> المكالمات النشطة
      </h3>
      <div className="space-y-2">
        {calls.map(call => (
          <div
            key={call.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <div className="flex items-center gap-3">
              <User className="text-gray-400" />
              <div>
                <p>{call.user}</p>
                <small className="text-gray-500">مدة: {call.duration}</small>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                إنهاء
              </button>
              <button className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400">
                تحويل
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveCalls;