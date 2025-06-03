'use client';
import CustomCalendar from '@/components/ui/Calendar';
import {useState} from 'react'
export default function StatementFilters({ onFilter }) {
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date()
  });

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <CustomCalendar
        mode="range"
        selected={dateRange}
        onSelect={(range) => {
          setDateRange(range);
          onFilter(range);
        }}
        className="border rounded-lg"
      />
      <select 
        className="p-2 border rounded-lg"
        onChange={(e) => onFilter({ type: e.target.value })}
      >
        <option value="all">جميع الأنواع</option>
        <option value="income">إيرادات</option>
        <option value="expense">مصروفات</option>
      </select>
    </div>
  );
}