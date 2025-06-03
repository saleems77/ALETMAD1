// app/payment/page.jsx
"use client"
import { useState, Suspense } from 'react';
import PaymentMethodsList from '@/components/Payment/PaymentMethodsList';
import PaymentHistoryTable from '@/components/Payment/PaymentHistoryTable';
import PaymentGatewayModal from '@/components/Payment/PaymentGatewayModal';

const PaymentPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">لوحة الدفع</h1>
      <PaymentMethodsList />
      <PaymentHistoryTable />
      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        فتح بوابة الدفع
      </button>
      {isModalOpen && <PaymentGatewayModal amount={100} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default PaymentPage;