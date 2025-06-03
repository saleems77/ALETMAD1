'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ConsentManager() {
  const [showSettings, setShowSettings] = useState(false);
  const [consentPreferences, setConsentPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const savedConsent = Cookies.get('consent');
    if (savedConsent) {
      setConsentPreferences(JSON.parse(savedConsent));
    }
  }, []);

  const savePreferences = () => {
    Cookies.set('consent', JSON.stringify(consentPreferences), {
      path: '/',
      expires: 365 // أيام
    });
    setShowSettings(false);
  };

  if (Cookies.get('consent') && !showSettings) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-6 rounded-xl shadow-xl border w-96">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">إدارة تفضيلات الخصوصية</h3>
        <button 
          onClick={() => setShowSettings(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">الضرورية</span>
          <input
            type="checkbox"
            checked={consentPreferences.necessary}
            disabled
            className="h-4 w-4 text-blue-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-medium">التحليلات</span>
            <p className="text-sm text-gray-500">تساعدنا على تحسين الخدمة</p>
          </div>
          <input
            type="checkbox"
            checked={consentPreferences.analytics}
            onChange={(e) => setConsentPreferences(prev => ({
              ...prev,
              analytics: e.target.checked
            }))}
            className="h-4 w-4 text-blue-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-medium">التسويق</span>
            <p className="text-sm text-gray-500">عروض مخصصة بناء على اهتماماتك</p>
          </div>
          <input
            type="checkbox"
            checked={consentPreferences.marketing}
            onChange={(e) => setConsentPreferences(prev => ({
              ...prev,
              marketing: e.target.checked
            }))}
            className="h-4 w-4 text-blue-600"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={savePreferences}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          حفظ التفضيلات
        </button>
        <button
          onClick={() => {
            setConsentPreferences({
              necessary: true,
              analytics: true,
              marketing: true
            });
            savePreferences();
          }}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          قبول الكل
        </button>
      </div>
    </div>
  );
}