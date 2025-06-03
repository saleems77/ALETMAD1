import { FaUsers, FaChartLine, FaPercentage } from 'react-icons/fa';

const RealTimeStats = ({ 
    activeUsers = 0, // <-- قيمة افتراضية
    sessions = 0, 
    bounceRate = 0 
  }) => {  return (
    <div className="real-time-stats bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">الإحصائيات اللحظية</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          icon={<FaUsers className="text-blue-500" />}
          title="المستخدمون النشطون"
          value={activeUsers.toLocaleString()}
          trend="+2.3%"
        />
        <StatCard
          icon={<FaChartLine className="text-green-500" />}
          title="الجلسات النشطة"
          value={sessions.toLocaleString()}
          trend="+5.1%"
        />
        <StatCard
          icon={<FaPercentage className="text-red-500" />}
          title="معدل الارتداد"
          value={`${(bounceRate * 100).toFixed(1)}%`}
          trend="-1.2%"
        />
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, trend }) => (
  <div className="stat-card p-4 border rounded-lg">
    <div className="flex items-center gap-3 mb-2">
      <div className="icon-container text-2xl">{icon}</div>
      <h3 className="font-medium">{title}</h3>
    </div>
    <div className="flex justify-between items-end">
      <span className="text-2xl font-bold">{value}</span>
      <span className={`text-sm ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {trend}
      </span>
    </div>
  </div>
);

export default RealTimeStats;