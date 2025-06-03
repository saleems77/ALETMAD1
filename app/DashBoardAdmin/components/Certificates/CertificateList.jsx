'use client';
import Link from 'next/link';

// بيانات وهمية للشهادات
const mockCertificates = [
  {
    certificateId: '1',
    recipientName: 'محمد أحمد',
    courseName: 'دورة تطوير الويب المتقدم',
    issueDate: '2024-03-15',
    instructor: 'أ. علي حسن'
  },
  {
    certificateId: '2',
    recipientName: 'فاطمة عمر',
    courseName: 'دورة الذكاء الاصطناعي',
    issueDate: '2024-02-28',
    instructor: 'د. سمير خالد'
  },
  {
    certificateId: '3',
    recipientName: 'خالد سعيد',
    courseName: 'دورة التسويق الرقمي',
    issueDate: '2024-04-01',
    instructor: 'أ. نورا محمد'
  }
];

export default function CertificateList() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">الشهادات المولدة</h3>
        <span className="text-gray-500">
          العدد الإجمالي: {mockCertificates.length}
        </span>
      </div>

      <div className="space-y-4">
        {mockCertificates.map(cert => (
          <div 
            key={cert.certificateId}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-800">{cert.recipientName}</p>
              <p className="text-gray-600 mt-1">{cert.courseName}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>تاريخ الإصدار: {cert.issueDate}</span>
                <span>|</span>
                <span>المدرب: {cert.instructor}</span>
              </div>
            </div>
            
            <Link
              href={`/certificates/${cert.certificateId}`}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors whitespace-nowrap"
            >
              عرض الشهادة
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}