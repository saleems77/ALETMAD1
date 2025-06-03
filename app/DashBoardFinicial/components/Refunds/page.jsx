'use client';
import { useState } from 'react';
import RefundPolicySection from './RefundPolicySection';
import RefundRequestForm from './RefundRequestForm';
import RefundStatusTracker from './RefundStatusTracker';

export default function RefundDashboard() {
  // بيانات وهمية للطلبات (تبدأ فارغة أو يمكنك تزويدها ببيانات تجريبية)
  const [refundRequests, setRefundRequests] = useState([]);

  const handleSaveRequest = (newRequest) => {
    setRefundRequests(prev => [...prev, newRequest]);
  };

  return (
    <div className="space-y-6">
      <RefundPolicySection />
      <RefundRequestForm onSaveRequest={handleSaveRequest} />
      <RefundStatusTracker refundRequests={refundRequests} />
    </div>
  );
}
