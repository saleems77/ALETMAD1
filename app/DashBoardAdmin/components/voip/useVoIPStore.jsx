"use client";

import React, { useState } from "react";
import { useVoIPStore } from "./VoIPContext"; // تأكد من صحة مسار الاستيراد

const VoIPManager = () => {
  const { activeCalls, startCall, endCall } = useVoIPStore();
  const [number, setNumber] = useState("");

  const handleStartCall = () => {
    if (number.trim()) {
      startCall(number.trim());
      setNumber("");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">إدارة المكالمات</h2>

      <div className="mb-4">
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="أدخل رقم الهاتف"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleStartCall}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          بدء مكالمة
        </button>
      </div>

      <h3 className="text-lg font-medium mb-2">المكالمات النشطة:</h3>
      {activeCalls.length === 0 ? (
        <p>لا توجد مكالمات نشطة حالياً.</p>
      ) : (
        <ul className="space-y-2">
          {activeCalls.map((call) => (
            <li
              key={call.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>
                📞 {call.number} — {call.status} — {call.startTime}
              </span>
              <button
                onClick={() => endCall(call.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                إنهاء
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VoIPManager;
