// src/components/ui/Calendar.jsx
'use client';
import { Calendar } from 'react-date-range';
import ar from 'date-fns/locale/ar-SA';
export default function CustomCalendar({ date, onChange }) {
  return (
    <Calendar
      date={date}
      onChange={onChange}
      locale={ar}
      direction="rtl"
      className="border rounded-lg shadow-lg"
    />
  );
}