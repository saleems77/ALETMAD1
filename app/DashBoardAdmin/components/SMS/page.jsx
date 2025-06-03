'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManualSender from './ManualSender';
import NotificationList from './NotificationList';

export default function NotificationsDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* العنوان الرئيسي */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            نظام إدارة الإشعارات
          </h1>
          <p className="text-gray-600 mt-2">
            أرسل رسائل فورية وادارة سجل الإشعارات
          </p>
        </header>

        {/* تبويبات النظام */}
        <Tabs defaultValue="send" className="bg-white rounded-xl shadow-lg">
          <TabsList className="w-full border-b">
            <TabsTrigger 
              value="send" 
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 px-6 py-3"
            >
              📩 إرسال إشعار جديد
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 px-6 py-3"
            >
              📚 سجل الإشعارات
            </TabsTrigger>
          </TabsList>

          {/* محتوى التبويب الأول - إرسال إشعار */}
          <TabsContent value="send" className="p-6">
            <ManualSender />
          </TabsContent>

          {/* محتوى التبويب الثاني - سجل الإشعارات */}
          <TabsContent value="history" className="p-6">
            <NotificationList />
          </TabsContent>
        </Tabs>

        {/* إحصاءات سريعة */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-green-600 font-semibold">الإشعارات الناجحة</h3>
            <p className="text-2xl mt-2">158</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-red-600 font-semibold">الإشعارات الفاشلة</h3>
            <p className="text-2xl mt-2">12</p>
          </div>
        </div>
      </div>
    </div>
  );
}