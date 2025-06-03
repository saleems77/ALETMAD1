"use client"
import React, { useState, useEffect } from 'react';
import { EnvelopeIcon, MagnifyingGlassIcon, FunnelIcon, ChartBarIcon, UserCircleIcon, CalendarIcon, ChevronUpDownIcon, CheckIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { toast, Toaster } from 'react-hot-toast';

// نظام الألوان المحدد
const COLORS = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

// بيانات وهمية موسعة
const mockStudents = [
  {
    id: 1,
    name: 'محمد أحمد',
    email: 'mohamed@example.com',
    courses: ['برمجة', 'تصميم'],
    registrationDate: '2024-01-15',
    lastActivity: '2024-03-20',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    name: 'أسماء علي',
    email: 'asma@example.com',
    courses: ['تسويق'],
    registrationDate: '2024-02-01',
    lastActivity: '2024-03-18',
    status: 'inactive',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 3,
    name: 'علي حسن',
    email: 'ali@example.com',
    courses: ['تصميم', 'تسويق'],
    registrationDate: '2024-03-01',
    lastActivity: '2024-03-25',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  }
];

const StudentMarketingDashboard = () => {
  const [students] = useState(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState(mockStudents);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filters, setFilters] = useState({
    searchQuery: '',
    course: '',
    startDate: '',
    endDate: '',
    activity: ''
  });
  const [emailContent, setEmailContent] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const timeoutId = setTimeout(() => applyFilters(), 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const applyFilters = () => {
    let result = [...students];

    if (filters.searchQuery) {
      result = result.filter(s => 
        s.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
        s.email.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    if (filters.course) {
      result = result.filter(s => s.courses.includes(filters.course));
    }

    if (filters.startDate && filters.endDate) {
      result = result.filter(s => 
        s.registrationDate >= filters.startDate && 
        s.registrationDate <= filters.endDate
      );
    }

    if (filters.activity) {
      result = result.filter(s => s.status === filters.activity);
    }

    setFilteredStudents(result);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredStudents].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredStudents(sortedData);
  };

  const handleSendEmails = async () => {
    if (selectedRows.length === 0) {
      toast.error('الرجاء تحديد مستخدمين أولاً');
      return;
    }

    const loadingToast = toast.loading('جاري إرسال الرسائل...');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`تم الإرسال بنجاح إلى ${selectedRows.length} مستخدم`, { id: loadingToast });
      setEmailContent('');
      setSelectedRows([]);
    } catch (error) {
      toast.error('حدث خطأ أثناء الإرسال', { id: loadingToast });
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      'الاسم,الإيميل,الدورات,تاريخ التسجيل,آخر نشاط',
      ...filteredStudents.map(s => 
        `${s.name},${s.email},"${s.courses.join(',')}",${s.registrationDate},${s.lastActivity}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    toast.success('تم تصدير الملف بنجاح');
  };

  const TableHeader = ({ label, sortKey }) => (
    <th 
      className="px-6 py-4 text-right cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(sortKey)}
      style={{ color: COLORS.black }}
    >
      <div className="flex items-center justify-end gap-2">
        {label}
        <ChevronUpDownIcon className="w-4 h-4" style={{ color: COLORS.gray }} />
        {sortConfig.key === sortKey && (
          <span style={{ color: COLORS.blue }}>
            {sortConfig.direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.white }}>
      <Toaster position="top-center" toastOptions={{ style: { backgroundColor: COLORS.white, color: COLORS.black } }} />

      {/* الهيدر */}
      <header className="p-4 mb-8 rounded-xl shadow-lg" style={{ backgroundColor: COLORS.blue }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-8 h-8" style={{ color: COLORS.white }} />
            <h1 className="text-2xl font-bold" style={{ color: COLORS.white }}>لوحة التحكم التسويقية</h1>
          </div>
          <div className="flex items-center gap-4" style={{ color: COLORS.white }}>
            <UserCircleIcon className="w-6 h-6" />
            <span>المسؤول</span>
          </div>
        </div>
      </header>

      {/* منطقة الفلترة */}
      <section className="p-6 mb-8 rounded-xl shadow-md" style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.gray}` }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-3" style={{ color: COLORS.gray }} />
            <input
              type="text"
              placeholder="بحث..."
              className="w-full pl-4 pr-10 py-3 rounded-lg border focus:ring-2"
              style={{ 
                borderColor: COLORS.gray,
                color: COLORS.black,
                backgroundColor: COLORS.white
              }}
              value={filters.searchQuery}
              onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
            />
          </div>

          <select 
            className="py-3 px-4 rounded-lg border"
            style={{ 
              borderColor: COLORS.gray,
              color: COLORS.black,
              backgroundColor: COLORS.white
            }}
            value={filters.course}
            onChange={(e) => setFilters({...filters, course: e.target.value})}
          >
            <option value="">جميع الدورات</option>
            <option value="برمجة">برمجة</option>
            <option value="تصميم">تصميم</option>
            <option value="تسويق">تسويق</option>
          </select>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <CalendarIcon className="w-5 h-5 absolute right-3 top-3" style={{ color: COLORS.gray }} />
              <input
                type="date"
                className="w-full pl-4 pr-10 py-3 rounded-lg border"
                style={{ 
                  borderColor: COLORS.gray,
                  color: COLORS.black,
                  backgroundColor: COLORS.white
                }}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            <div className="relative flex-1">
              <CalendarIcon className="w-5 h-5 absolute right-3 top-3" style={{ color: COLORS.gray }} />
              <input
                type="date"
                className="w-full pl-4 pr-10 py-3 rounded-lg border"
                style={{ 
                  borderColor: COLORS.gray,
                  color: COLORS.black,
                  backgroundColor: COLORS.white
                }}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
          </div>

          <select
            className="py-3 px-4 rounded-lg border"
            style={{ 
              borderColor: COLORS.gray,
              color: COLORS.black,
              backgroundColor: COLORS.white
            }}
            value={filters.activity}
            onChange={(e) => setFilters({...filters, activity: e.target.value})}
          >
            <option value="">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>
      </section>

      {/* جدول البيانات */}
      <section className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: COLORS.white }}>
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: COLORS.gray }}>
          <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: COLORS.black }}>
            <FunnelIcon className="w-6 h-6" style={{ color: COLORS.blue }} />
            قائمة الطلاب
          </h2>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:shadow-md"
            style={{ 
              backgroundColor: COLORS.yellow,
              color: COLORS.black
            }}
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            تصدير البيانات
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: COLORS.white }}>
                <TableHeader label="الاسم" sortKey="name" />
                <TableHeader label="الإيميل" sortKey="email" />
                <TableHeader label="الدورات" sortKey="courses" />
                <TableHeader label="تاريخ التسجيل" sortKey="registrationDate" />
                <TableHeader label="آخر نشاط" sortKey="lastActivity" />
                <th className="px-6 py-4 text-right" style={{ color: COLORS.black }}>اختيار</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: COLORS.gray }}>
              {filteredStudents.map((student, index) => (
                <tr 
                  key={student.id}
                  className="hover:bg-opacity-10 transition-colors"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? COLORS.white : `${COLORS.gray}10`,
                    borderColor: COLORS.gray
                  }}
                >
                  <td className="px-6 py-4" style={{ color: COLORS.black }}>
                    <div className="flex items-center gap-3">
                      <img 
                        src={student.avatar} 
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover border"
                        style={{ borderColor: COLORS.gray }}
                      />
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: COLORS.black }}>{student.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {student.courses.map(course => (
                        <span 
                          key={course}
                          className="px-3 py-1 rounded-full text-sm"
                          style={{ 
                            backgroundColor: `${COLORS.blue}20`,
                            color: COLORS.blue
                          }}
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: COLORS.black }}>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" style={{ color: COLORS.gray }} />
                      {student.registrationDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.some(s => s.id === student.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows([...selectedRows, student]);
                        } else {
                          setSelectedRows(selectedRows.filter(s => s.id !== student.id));
                        }
                      }}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      style={{ 
                        borderColor: COLORS.gray,
                        color: COLORS.blue
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* محرر الإيميلات */}
      <section className="mt-8 p-6 rounded-xl shadow-lg" style={{ backgroundColor: COLORS.white }}>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.black }}>
          <EnvelopeIcon className="w-6 h-6" style={{ color: COLORS.blue }} />
          محرر الرسائل
        </h3>
        
        <div className="relative">
          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="اكتب محتوى الرسالة هنا..."
            className="w-full p-4 rounded-lg border focus:ring-2"
            style={{
              borderColor: COLORS.gray,
              color: COLORS.black,
              backgroundColor: COLORS.white
            }}
            maxLength={2000}
          />
          <div className="absolute bottom-4 left-4 text-sm" style={{ color: COLORS.gray }}>
            {emailContent.length}/2000 حرف
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSendEmails}
            disabled={selectedRows.length === 0 || emailContent.length === 0}
            className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.yellow} 100%)`,
              color: COLORS.white,
              boxShadow: `0 4px 6px ${COLORS.gray}30`,
              opacity: selectedRows.length === 0 || emailContent.length === 0 ? 0.5 : 1
            }}
          >
            <EnvelopeIcon className="w-5 h-5" />
            إرسال الرسائل
          </button>
        </div>
      </section>

      {/* التذييل */}
      <footer className="mt-8 p-4 text-center rounded-xl" style={{ backgroundColor: COLORS.black }}>
        <p className="text-sm" style={{ color: COLORS.white }}>© 2024 جميع الحقوق محفوظة</p>
      </footer>

      {/* الأنيميشن المخصصة */}
      <style jsx global>{`
        tr:hover {
          background-color: ${COLORS.blue}08 !important;
        }
        
        button:hover {
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
        
        input, select, textarea {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default StudentMarketingDashboard;