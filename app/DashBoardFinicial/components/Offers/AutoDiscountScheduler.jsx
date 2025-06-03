'use client';
import { useState } from 'react';
import { Recycle } from 'lucide-react';

const AutoDiscountScheduler = () => {
  const [schedule, setSchedule] = useState({
    frequency: 'weekly',
    nextRun: new Date(),
    discountTemplate: null,
  });

  const scheduleOptions = [
    { value: 'daily', label: 'يومي' },
    { value: 'weekly', label: 'أسبوعي' },
    { value: 'monthly', label: 'شهري' },
  ];

  // تطبيق الجدولة باستخدام بيانات وهمية
  const applySchedule = () => {
    console.log('Schedule applied:', schedule);
    alert('تم جدولة التخفيض التلقائي');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Recycle className="w-5 h-5" />
        الجدولة التلقائية
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>التكرار</label>
          <select
            value={schedule.frequency}
            onChange={(e) =>
              setSchedule({ ...schedule, frequency: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            {scheduleOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label>البداية التالية</label>
          <input
            type="datetime-local"
            value={schedule.nextRun.toISOString().slice(0, 16)}
            onChange={(e) =>
              setSchedule({ ...schedule, nextRun: new Date(e.target.value) })
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={applySchedule}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        تفعيل الجدولة
      </button>
    </div>
  );
};

export default AutoDiscountScheduler;
