'use client';
import { HiCalendar, HiCheckCircle, HiXCircle } from 'react-icons/hi';

// تعريف الإعدادات لكل حالة
const statuses = {
  pending: {
    bg: 'bg-yellow-500', // لون الخلفية للدائرة
    icon: HiCalendar,
    label: 'قيد المراجعة',
    badgeBg: 'bg-yellow-100', // خلفية البادج
    text: 'text-yellow-700'    // لون النص في البادج
  },
  approved: {
    bg: 'bg-green-500',
    icon: HiCheckCircle,
    label: 'مقبول',
    badgeBg: 'bg-green-100',
    text: 'text-green-700'
  },
  rejected: {
    bg: 'bg-red-500',
    icon: HiXCircle,
    label: 'مرفوض',
    badgeBg: 'bg-red-100',
    text: 'text-red-700'
  }
};

export default function RefundStatusTracker({ refundRequests }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">متابعة حالة الطلبات</h2>
      
      {refundRequests.length === 0 ? (
        <p className="text-gray-500">لا توجد طلبات حالية</p>
      ) : (
        // إنشاء خط زمني باستخدام div مع border-left
        <div className="relative border-l border-gray-300 pl-4">
          {refundRequests.map((request) => {
            // الحصول على الإعدادات المناسبة للحالة أو استخدام pending كافتراضي
            const status = statuses[request.status] || statuses.pending;
            const Icon = status.icon;
            return (
              <div key={request.id} className="mb-6">
                <div className="flex items-center mb-1">
                  {/* الدائرة التي تحتوي على الأيقونة */}
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${status.bg} text-white`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="ml-4 text-lg font-medium">
                    طلب #{request.id.slice(-6)}
                  </h3>
                  {/* البادج الذي يوضح حالة الطلب */}
                  <span className={`ml-auto px-2 py-1 rounded text-sm ${status.badgeBg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-1">
                  {new Date(request.createdAt).toLocaleDateString('ar-SA')}
                </p>
                <p className="text-gray-600">
                  {request.reason}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
