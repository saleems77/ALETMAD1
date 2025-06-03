// app/subscriptions/page.jsx
import { Suspense } from 'react';
import UserSubscriptionStatus from '@/app/DashBoardStudent/components/Subscription/UserSubscriptionStatus';
import SubscriptionPlans from '@/app/DashBoardStudent/components/Subscription/SubscriptionPlans';
import PlanComparisonTable from '@/app/DashBoardStudent/components/Subscription/PlanComparisonTable';

export default function SubscriptionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <UserSubscriptionStatus />
        <SubscriptionPlans />
        <PlanComparisonTable />
      </Suspense>
    </div>
  );
}