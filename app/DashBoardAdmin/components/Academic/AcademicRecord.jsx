'use client';
import { Timeline, TimelineItem } from '@/components/Timeline';
import { mockCourses } from '@/data/mockAcademicData';

export default function AcademicRecord() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">السجل الأكاديمي</h2>
      <Timeline>
        {mockCourses.map((course, index) => (
          <TimelineItem 
            key={index}
            date={course.date}
            title={course.name}
            status={course.status}
            grade={course.grade}
          />
        ))}
      </Timeline>
    </div>
  );
}