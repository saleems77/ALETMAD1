// components/dashboard/AssistantDashboard.jsx
import { useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// بيانات افتراضية
const initialStats = {
  totalStudents: 324,
  attendanceRate: 78,
  ongoingTasks: 15,
};

const chartColors = {
  primary: '#4F46E5',   // لون أزرق ملكي
  secondary: '#10B981', // لون أخضر زمردي
  accent: '#8B5CF6',    // لون بنفسجي ناعم
};

// بيانات الرسوم البيانية الافتراضية
const performanceData = [
  { week: 'الأسبوع ١', attendance: 65, performance: 70 },
  { week: 'الأسبوع ٢', attendance: 75, performance: 78 },
  { week: 'الأسبوع ٣', attendance: 82, performance: 85 },
  { week: 'الأسبوع ٤', attendance: 78, performance: 80 },
];

const taskDistribution = [
  { name: 'مكتملة', value: 8 },
  { name: 'قيد التنفيذ', value: 4 },
  { name: 'معلقة', value: 3 },
];

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${trend.color}`}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-2 flex items-center text-sm">
        <span className={`${trend.textColor} flex items-center`}>
          {trend.icon}
          {trend.value}
        </span>
        <span className="text-gray-500 ml-2">عن الشهر الماضي</span>
      </div>
    )}
  </div>
);

const ActivityFeed = ({ activities }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm h-full">
    <h3 className="text-lg font-semibold mb-4">النشاط الأخير</h3>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start border-b pb-4 last:border-0">
          <div className={`p-2 rounded-lg ${activity.color} mr-3`}>
            {activity.icon}
          </div>
          <div>
            <p className="text-sm font-medium">{activity.title}</p>
            <p className="text-xs text-gray-500">{activity.date}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AssistantDashboard = () => {
  const [stats] = useState(initialStats);
  const [activities] = useState([
    {
      title: "تم تحديث دورة الرياضيات",
      date: "٢٥ مايو ٢٠٢٤",
      icon: '📚',
      color: 'bg-purple-100'
    },
    {
      title: "مهمة جديدة: جدولة الاختبار",
      date: "٢٤ مايو ٢٠٢٤",
      icon: '✅',
      color: 'bg-green-100'
    },
  ]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">لوحة الإحصاءات</h1>
      
      {/* بطاقات المؤشرات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="إجمالي الطلاب"
          value={stats.totalStudents}
          icon="👨🎓"
          trend={{
            value: '+12%',
            icon: '↑',
            textColor: 'text-green-600',
            color: 'bg-blue-100'
          }}
        />
        
        <StatCard
          title="نسبة الحضور"
          value={`${stats.attendanceRate}%`}
          icon="📊"
          trend={{
            value: '+5%',
            icon: '↑',
            textColor: 'text-green-600',
            color: 'bg-green-100'
          }}
        />
        
        <StatCard
          title="المهام الجارية"
          value={stats.ongoingTasks}
          icon="📝"
          trend={{
            value: '-2%',
            icon: '↓',
            textColor: 'text-red-600',
            color: 'bg-red-100'
          }}
        />
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">أداء الدورات (آخر ٤ أسابيع)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke={chartColors.primary}
                  strokeWidth={2}
                  name="الحضور"
                />
                <Line 
                  type="monotone" 
                  dataKey="performance" 
                  stroke={chartColors.secondary}
                  strokeWidth={2}
                  name="الأداء"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">توزيع المهام</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={[
                        chartColors.primary,
                        chartColors.secondary,
                        chartColors.accent
                      ][index % 3]} 
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* النشاط الأخير */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* يمكن إضافة محتوى إضافي هنا */}
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default AssistantDashboard;