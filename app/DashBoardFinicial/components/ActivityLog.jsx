// app/DashBoardEmployee/components/ActivityLog.jsx
const ActivityLog = ({ logs }) => {
    return (
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{log.title}</p>
              <p className="text-sm text-gray-500">{log.time}</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800">
              عرض التفاصيل
            </button>
          </div>
        ))}
      </div>
    );
  };
  
  export default ActivityLog;