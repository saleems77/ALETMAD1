import { formatDate } from '@/utils/formatters';

export default function FinancialHeader({ title, lastUpdated }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-500 mt-2">
        آخر تحديث: {formatDate(lastUpdated)}
      </p>
    </div>
  );
}