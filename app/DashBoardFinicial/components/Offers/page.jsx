// app/admin/offers/page.jsx
import { Suspense } from 'react';
import DiscountManager from './DiscountManager';
import AutoDiscountScheduler from './AutoDiscountScheduler';
import ActiveOffersList from './ActiveOffersList';

export default function OffersPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <div className="space-y-6">
        <Suspense fallback={<div>جاري التحميل...</div>}>
          <DiscountManager />
          <AutoDiscountScheduler />
        </Suspense>
      </div>
      <div>
        <Suspense fallback={<div>جاري التحميل...</div>}>
          <ActiveOffersList />
        </Suspense>
      </div>
    </div>
  );
}