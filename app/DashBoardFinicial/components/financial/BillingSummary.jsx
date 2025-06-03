'use client';
import { Pie } from 'react-chartjs-2';

export default function BillingSummary({ invoices }) {
  const data = {
    labels: ['مدفوع', 'غير مدفوع', 'متأخر'],
    datasets: [{
      data: [
        invoices.filter(i => i.status === 'paid').length,
        invoices.filter(i => i.status === 'unpaid').length,
        invoices.filter(i => i.status === 'overdue').length
      ],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
    }]
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold mb-4">توزيع حالة الفواتير</h3>
      <div className="max-w-xs mx-auto">
        <Pie data={data} />
      </div>
    </div>
  );
}