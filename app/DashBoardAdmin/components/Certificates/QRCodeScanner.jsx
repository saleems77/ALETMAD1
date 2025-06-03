'use client';
import { useState } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/router';

export default function QRCodeScanner() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleScan = (result) => {
    if (result) {
      const certificateId = result.text.split('/').pop();
      router.push(`/certificates/${certificateId}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-black rounded-xl overflow-hidden">
        <QrScanner
          onResult={(result, error) => {
            if (result) handleScan(result);
            if (error) setError('تعذر قراءة QR Code');
          }}
          constraints={{ facingMode: 'environment' }}
          className="w-full"
        />
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <p className="mt-4 text-center text-gray-600">
        قم بتوجيه الكاميرا نحو رمز الاستجابة السريعة
      </p>
    </div>
  );
}