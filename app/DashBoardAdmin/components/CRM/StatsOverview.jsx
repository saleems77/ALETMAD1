'use client';
import { useCRM } from '@/hooks/useCRM';

export default function StatsOverview() {
  const { stats } = useCRM();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-blue-50 p-4 rounded-xl">
        <h3 className="text-gray-500">إجمالي العملاء</h3>
        <p className="text-2xl font-bold">{stats.totalClients}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-xl">
        <h3 className="text-gray-500">تفاعلات هذا الشهر</h3>
        <p className="text-2xl font-bold">{stats.monthlyInteractions}</p>
      </div>
    </div>
  );
}