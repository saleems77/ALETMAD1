'use client';
import { QRCode } from 'react-qr-code';
import { useEffect, useState } from 'react';

export default function CertificatePreview({ values = {} }) {
  // حالة لتجنب أخطاء التصيير على الخادم
  const [isMounted, setIsMounted] = useState(false);

  // القيم الافتراضية
  const {
    recipientName = 'اسم المتلقي',
    courseName = 'اسم الدورة',
    certificateId = 'ID123',
    issueDate = new Date()
  } = values;

  // عنوان URL للرمز QR مع التعامل مع SSR
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      setQrValue(`${window.location.origin}/certificates/${certificateId}`);
    }
  }, [certificateId]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="border-2 border-dashed border-gray-200 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">معاينة الشهادة</h2>
        
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold">{recipientName}</p>
          <p className="text-lg text-gray-600">قد أتم بنجاح دورة</p>
          <p className="text-xl text-blue-600 font-bold">{courseName}</p>
          
          {/* عرض QR فقط عند التحميل على العميل */}
          {isMounted && (
            <div className="mt-8 mx-auto w-32 h-32">
              <QRCode
                value={qrValue}
                size={128}
                className="w-full h-full"
              />
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-4">
            تاريخ الإصدار: {new Date(issueDate).toLocaleDateString('ar-SA')}
          </p>
        </div>
      </div>
    </div>
  );
}