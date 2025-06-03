'use client';
import { useState } from 'react';
import DatePicker from 'react-datepicker';

const LiveStreamScheduler = ({ onSchedule }) => {
  const [streamData, setStreamData] = useState({
    title: '',
    description: '',
    scheduledTime: new Date(),
    duration: 60
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduledStreams = JSON.parse(localStorage.getItem('scheduledStreams') || '[]');
    const newStream = {
      ...streamData,
      id: crypto.randomUUID(),
      status: 'scheduled'
    };
    localStorage.setItem('scheduledStreams', JSON.stringify([...scheduledStreams, newStream]));
    onSchedule(newStream);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">جدولة بث مباشر</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>عنوان البث</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={streamData.title}
            onChange={(e) => setStreamData({...streamData, title: e.target.value})}
            required
          />
        </div>

        <div>
          <label>الوصف</label>
          <textarea
            className="w-full p-2 border rounded h-24"
            value={streamData.description}
            onChange={(e) => setStreamData({...streamData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>التاريخ والوقت</label>
            <DatePicker
              selected={streamData.scheduledTime}
              onChange={(date) => setStreamData({...streamData, scheduledTime: date})}
              showTimeSelect
              dateFormat="yyyy/MM/dd hh:mm aa"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label>المدة (دقيقة)</label>
            <input
              type="number"
              min="30"
              max="180"
              className="w-full p-2 border rounded"
              value={streamData.duration}
              onChange={(e) => setStreamData({...streamData, duration: e.target.value})}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          حفظ الجدولة
        </button>
      </form>
    </div>
  );
};
export default LiveStreamScheduler;
