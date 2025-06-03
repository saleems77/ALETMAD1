import { formatCurrency } from '@/utils/formatters';

export default function FinancialSummary({ totalAmount, totalTransactions }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-blue-600 font-semibold">إجمالي الرصيد</h3>
        <p className="text-2xl mt-2">{formatCurrency(totalAmount)}</p>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-green-600 font-semibold">عدد المعاملات</h3>
        <p className="text-2xl mt-2">{totalTransactions}</p>
      </div>
    </div>
  );
}