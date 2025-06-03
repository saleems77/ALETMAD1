'use client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import CertificateTemplate from './CertificateTemplate';

export default function DownloadButton({ certificate }) {
  return (
    <PDFDownloadLink
      document={<CertificateTemplate {...certificate} />}
      fileName={`شهادة_${certificate.courseName}.pdf`}
      className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
    >
      {({ loading }) => (
        <>
          <ArrowDownTrayIcon className="w-5 h-5" />
          {loading ? 'جاري التجهيز...' : 'تحميل الشهادة'}
        </>
      )}
    </PDFDownloadLink>
  );
}