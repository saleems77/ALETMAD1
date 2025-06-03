'use client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoiceTemplate from './InvoiceTemplate';

export default function InvoiceGenerator({ invoiceData }) {
  return (
    <PDFDownloadLink
      document={<InvoiceTemplate {...invoiceData} />}
      fileName={`invoice_${invoiceData.id}.pdf`}
      className="bg-green-600 text-white px-4 py-2 rounded-lg"
    >
      {({ loading }) => (loading ? 'جاري التجهيز...' : 'تحميل الفاتورة')}
    </PDFDownloadLink>
  );
}