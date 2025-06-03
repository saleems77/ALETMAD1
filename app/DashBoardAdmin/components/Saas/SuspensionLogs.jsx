'use client';
import { useLicenseStore } from './LicenseContext';
import { FiClock, FiAlertCircle } from 'react-icons/fi';

export default function SuspensionLogs() {
  const { suspendedClients } = useLicenseStore();

  return (
    <div className="card bg-base-100 p-6 shadow-md">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
        <FiAlertCircle className="text-red-500" /> 
        سجلات الإيقاف المؤقت
      </h3>
      
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>اسم العميل</th>
              <th>تاريخ الإيقاف</th>
              <th>السبب</th>
              <th>الحالة الحالية</th>
            </tr>
          </thead>
          <tbody>
            {suspendedClients.map(client => 
              client.suspensionLog.map((log, index) => (
                <tr key={`${client.id}-${index}`} className="hover">
                  <td>{client.name}</td>
                  <td className="flex items-center gap-2">
                    <FiClock /> 
                    {new Date(log.date).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="text-red-500 font-medium">
                    {log.reason || 'بدون سبب مذكور'}
                  </td>
                  <td>
                    <span className="badge badge-error">
                      {client.status === 'suspended' ? 'موقف حاليا' : 'تم إعادة التفعيل'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}