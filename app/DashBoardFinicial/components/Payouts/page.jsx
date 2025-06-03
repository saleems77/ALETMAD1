// app/payouts/page.jsx
import PayoutsCalculator from './PayoutsCalculator';
import PayoutsSchedule from './PayoutsSchedule';
import PayoutHistory from './PayoutHistory';

export default function PayoutsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        <PayoutsCalculator />
        <PayoutsSchedule />
      </div>
      <div>
        <PayoutHistory />
      </div>
    </div>
  );
}