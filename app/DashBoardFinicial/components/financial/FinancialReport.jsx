// components/Financial/FinancialReport.jsx
import { formatCurrency } from '@/utils/formatters';

const FinancialReport = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">التقرير الشهري</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {data.map((report) => (
          <div key={report.month} className="border p-4 rounded">
            <h3 className="font-bold text-lg">{report.month}</h3>
            <div className="mt-2 space-y-2">
              <p>الإيرادات: {formatCurrency(report.totalIncome)}</p>
              <p>المصروفات: {formatCurrency(report.totalExpenses)}</p>
              <p>صافي الربح: {formatCurrency(report.netProfit)}</p>
              <p>عدد المعاملات: {report.transactionsCount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialReport;