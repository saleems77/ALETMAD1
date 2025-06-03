// src/components/CalendarView.jsx
"use client";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ar'; // دعم اللغة العربية
import { useState , useEffect } from 'react';
// تهيئة الـ localizer
const localizer = momentLocalizer(moment);

const CalendarView = ({ posts }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const formattedEvents = posts.map(post => ({
      title: post.content.slice(0, 20) + '...',
      start: new Date(post.scheduledAt),
      end: new Date(post.scheduledAt),
    }));
    setEvents(formattedEvents);
  }, [posts]);

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer} // إضافة الـ localizer هنا
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        messages={{
          today: 'اليوم',
          previous: 'السابق',
          next: 'التالي',
          month: 'شهر',
          week: 'أسبوع',
          day: 'يوم',
        }}
      />
    </div>
  );
};

export default CalendarView;