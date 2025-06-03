import React from 'react';

const ActivityLog = ({ logs }) => {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-right">التاريخ</th>
            <th className="px-4 py-3 text-right">الإجراء</th>
            <th className="px-4 py-3 text-right">المستخدم</th>
            <th className="px-4 py-3 text-right">التفاصيل</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {logs.map(log => (
            <tr key={log.id}>
              <td className="px-4 py-3 text-sm">{formatDate(log.timestamp)}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {log.action}
                </span>
              </td>
              <td className="px-4 py-3">{log.user}</td>
              <td className="px-4 py-3 text-gray-600">{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLog;