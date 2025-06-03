'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PDFDownloadLink } from '@react-pdf/renderer';
import CertificateTemplate from './CertificateTemplate';
import QRCode from 'react-qr-code';

// بيانات وهمية
const mockCertificates = [
  {
    certificateId: '1',
    courseName: 'دورة تطوير الويب',
    recipientName: 'محمد أحمد',
    issueDate: '2024-03-01',
    instructorName: 'أ. علي حسن',
    courseDuration: '6 أسابيع',
    verificationLink: '/certificates/1'
  },
  {
    certificateId: '2',
    courseName: 'دورة الذكاء الاصطناعي',
    recipientName: 'فاطمة عمر',
    issueDate: '2024-02-15',
    instructorName: 'د. سمير خالد',
    courseDuration: '8 أسابيع',
    verificationLink: '/certificates/2'
  }
];

export default function CertificateViewer() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    if (id) {
      const foundCert = mockCertificates.find(c => c.certificateId === id);
      setCertificate(foundCert || null);
    }
  }, [id]);

  useEffect(() => {
    if (typeof window !== 'undefined' && certificate) {
      setQrValue(`${window.location.origin}${certificate.verificationLink}`);
    }
  }, [certificate]);

  if (!certificate) return <div className="text-center p-8">جاري التحميل أو الشهادة غير موجودة...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">{certificate.courseName}</h1>
        <p className="text-gray-600 mt-2">تمنح لـ: {certificate.recipientName}</p>
        <p className="text-gray-500 mt-1">بتاريخ: {certificate.issueDate}</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        {qrValue && (
          <div className="w-64 h-64 bg-gray-100 p-4 rounded-lg">
            <QRCode 
              value={qrValue}
              size={256}
              className="w-full h-full"
            />
          </div>
        )}

        <div className="space-y-4 w-full max-w-md">
          <div className="flex justify-between border-b py-2">
            <span className="font-medium">المدرب:</span>
            <span>{certificate.instructorName}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-medium">مدة الدورة:</span>
            <span>{certificate.courseDuration}</span>
          </div>
        </div>

        <PDFDownloadLink 
          document={<CertificateTemplate {...certificate} />}
          fileName={`شهادة_${certificate.courseName}.pdf`}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          {({ loading }) => (loading ? 'جاري التجهيز...' : 'تحميل PDF')}
        </PDFDownloadLink>
      </div>
    </div>
  );
}