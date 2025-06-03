'use client';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar, Clock } from 'lucide-react';
import { ar } from 'date-fns/locale';

// بيانات وهمية للجدولة
const useMockSchedule = () => {
  const [schedule, setSchedule] = useState({
    frequency: 'monthly',
    nextDate: new Date(),
    lastRun: '2024-03-01'
  });

  return { schedule, setSchedule };
};

const PayoutsSchedule = () => {
  const { schedule, setSchedule } = useMockSchedule();
  
  const handleFrequencyChange = (e) => {
    setSchedule(prev => ({
      ...prev,
      frequency: e.target.value
    }));
  };

  const handleDateChange = (date) => {
    if (date < new Date()) {
      alert('لا يمكن اختيار تاريخ ماضي');
      return;
    }
    setSchedule(prev => ({ ...prev, nextDate: date }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl font-bold">جدولة التسويات</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">التكرار</label>
          <select
            value={schedule.frequency}
            onChange={handleFrequencyChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">يومي</option>
            <option value="weekly">أسبوعي</option>
            <option value="monthly">شهري</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">التاريخ التالي</label>
          <DatePicker
            selected={schedule.nextDate}
            onChange={handleDateChange}
            locale={ar}
            dateFormat="dd/MM/yyyy"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span>آخر تنفيذ: {schedule.lastRun}</span>
        </div>
      </div>
    </div>
  );
};

export default PayoutsSchedule;