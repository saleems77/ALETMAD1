// components/VoIPIntegration.jsx
import { useEffect } from 'react';
import { useVoIPStore } from './useVoIPStore';
import { Call, Phone, User } from 'lucide-react';
import { toast } from 'sonner'; // لإشعارات المستخدم [[9]]

const VoIPIntegration = () => {
  const {
    activeCalls,
    contacts,
    initiateCall,
    endCall,
    fetchContacts,
    isLoading,
    error,
  } = useVoIPStore();

  // جلب جهات الاتصال عند تحميل المكون
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // معالجة الأخطاء باستخدام إشعارات مخصصة [[3]]
  useEffect(() => {
    if (error) {
      toast.error(`حدث خطأ: ${error.message}`);
    }
  }, [error]);

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
      {/* واجهة بدء المكالمات */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
          <Phone className="text-blue-500" /> بدء مكالمة جديدة
        </h3>
        <div className="flex gap-2">
          <select
            className="flex-1 p-2 border rounded"
            onChange={(e) => initiateCall(e.target.value)}
          >
            <option>اختر جهة اتصال</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => initiateCall()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            اتصال
          </button>
        </div>
      </div>

      {/* عرض المكالمات النشطة مع التكامل الفعلي [[6]] */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
          <Call className="text-purple-500" /> المكالمات النشطة
        </h3>
        {isLoading ? (
          <p>جارٍ التحميل...</p>
        ) : (
          activeCalls.map((call) => (
            <div
              key={call.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded mb-2"
            >
              <div className="flex items-center gap-3">
                <User className="text-gray-400" />
                <div>
                  <p>{call.contactName}</p>
                  <small className="text-gray-500">مدة: {call.duration}</small>
                </div>
              </div>
              <button
                onClick={() => endCall(call.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                إنهاء
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VoIPIntegration;