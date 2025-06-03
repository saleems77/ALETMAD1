// components/dashboard/StudentTracking.jsx
import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// بيانات افتراضية
const studentData = [
  {
    id: 1,
    name: "محمد أحمد",
    course: "الرياضيات الأساسية",
    attendance: 92,
    lastActivity: "2024-05-28",
    assignments: 8,
    completed: 6,
    engagement: 78
  },
  {
    id: 2,
    name: "فاطمة خالد",
    course: "أساسيات البرمجة",
    attendance: 85,
    lastActivity: "2024-05-27",
    assignments: 5,
    completed: 5,
    engagement: 95
  },
];

const attendanceData = [
  { week: 'الأسبوع ١', present: 65, absent: 15 },
  { week: 'الأسبوع ٢', present: 75, absent: 10 },
  { week: 'الأسبوع ٣', present: 82, absent: 8 },
  { week: 'الأسبوع ٤', present: 78, absent: 12 },
];

const engagementData = [
  { course: 'الرياضيات', quizzes: 75, assignments: 82, discussions: 65 },
  { course: 'البرمجة', quizzes: 88, assignments: 90, discussions: 78 },
];

const colors = {
  primary: '#4F46E5',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#F8FAFC'
};

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`p-3 rounded-lg text-2xl ${trend.color}`}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-2 flex items-center text-sm">
        <span className={`${trend.textColor} flex items-center`}>
          {trend.icon} {trend.value}
        </span>
      </div>
    )}
  </div>
);

const StudentRow = ({ student }) => (
  <div className="grid grid-cols-5 items-center bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
        👤
      </div>
      <div>
        <p className="font-medium text-gray-800">{student.name}</p>
        <p className="text-sm text-gray-600">{student.course}</p>
      </div>
    </div>
    
    <div>
      <div className="flex items-center gap-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full" 
            style={{ width: `${student.attendance}%` }}
          />
        </div>
        <span className="text-sm text-gray-600">{student.attendance}%</span>
      </div>
    </div>
    
    <div className="text-center">
      <span className={`px-3 py-1 rounded-full text-sm ${
        student.engagement >= 90 ? 'bg-green-100 text-green-800' :
        student.engagement >= 75 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
      }`}>
        {student.engagement}%
      </span>
    </div>
    
    <div className="text-center">
      <p className="text-gray-800">{student.completed}/{student.assignments}</p>
      <p className="text-sm text-gray-500">مهام مكتملة</p>
    </div>
    
    <div className="text-right">
      <p className="text-sm text-gray-600">
        {new Date(student.lastActivity).toLocaleDateString('ar-EG')}
      </p>
      <p className="text-xs text-gray-500">آخر نشاط</p>
    </div>
  </div>
);

const StudentTracking = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">متابعة الطلاب</h1>
      
      {/* بطاقات المؤشرات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="إجمالي الطلاب"
          value="324"
          icon="👥"
          trend={{ value: '+15%', icon: '↑', color: 'bg-blue-100', textColor: 'text-blue-600' }}
        />
        <StatCard
          title="متوسط الحضور"
          value="82%"
          icon="📊"
          trend={{ value: '+3%', icon: '↑', color: 'bg-green-100', textColor: 'text-green-600' }}
        />
        <StatCard
          title="طلاب نشطين"
          value="289"
          icon="🎯"
          trend={{ value: '+22%', icon: '↑', color: 'bg-orange-100', textColor: 'text-orange-600' }}
        />
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">تطور الحضور الأسبوعي</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="present" 
                  stroke={colors.primary}
                  strokeWidth={2}
                  name="الحضور"
                />
                <Line 
                  type="monotone" 
                  dataKey="absent" 
                  stroke={colors.accent}
                  strokeWidth={2}
                  name="الغياب"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">معدل التفاعل حسب المادة</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quizzes" fill={colors.primary} name="الاختبارات" />
                <Bar dataKey="assignments" fill={colors.secondary} name="المهام" />
                <Bar dataKey="discussions" fill={colors.accent} name="المناقشات" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* قائمة الطلاب */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">تفاصيل الطلاب</h2>
          <p className="text-gray-600">آخر التحديثات: ٢٨ مايو ٢٠٢٤</p>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-5 bg-gray-50 p-3 rounded-lg text-gray-600 text-sm">
            <span>الطالب</span>
            <span>الحضور</span>
            <span>التفاعل</span>
            <span>المهام</span>
            <span className="text-right">آخر نشاط</span>
          </div>
          
          {studentData.map(student => (
            <StudentRow 
              key={student.id} 
              student={student} 
              onClick={() => setSelectedStudent(student)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentTracking;