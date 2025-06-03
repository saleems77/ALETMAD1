'use client';
import { useNotifications } from './useNotifications';

export default function NotificationList() {
  const { notifications } = useNotifications();

  return (
    <div className="bg-white rounded-xl shadow">
      {notifications.map(notification => (
        <div key={notification.id} className="p-4 border-b last:border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{notification.recipient}</p>
              <p className="text-gray-600">{notification.message}</p>
            </div>
            <span className={`badge ${notification.status === 'sent' ? 'bg-green-100' : 'bg-red-100'}`}>
              {notification.status === 'sent' ? 'تم الإرسال' : 'فشل الإرسال'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}