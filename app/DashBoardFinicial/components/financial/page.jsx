// app/dashboard/financial/page.jsx
"use client"
import { Suspense } from 'react';
import FinancialHeader from './FinancialHeader';
import TransactionList from './TransactionList';
import FinancialSummary from './FinancialSummary';
import StatementFilters from './StatementFilters';
import FinancialCharts from './FinancialCharts';
import ExportControls from './ExportControls';
import { useTransactions } from './useTransactions';
import { generateMonthlyReport } from '@/utils/financialReports';

export default function FinancialDashboard() {
  const {
    transactions,
    loading,
    error,
    updateFilters,
    sortTransactions,
    totalAmount,
    totalEntries
  } = useTransactions();

  return (
    <div className="financial-dashboard p-6 bg-gray-50 min-h-screen">
      <FinancialHeader 
        title="لوحة تحكم الحساب المالي"
        lastUpdated="2024-03-20"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* فلترة البيانات */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <StatementFilters onFilter={updateFilters} />
            <ExportControls transactions={transactions} />
          </div>
        </div>

        {/* العرض الرئيسي */}
        <div className="lg:col-span-3">
          <Suspense fallback={<FinancialLoading />}>
            <div className="space-y-6">
              {/* حالة التحميل والأخطاء */}
              {loading && <FinancialLoading />}
              {error && <FinancialError error={error} />}

              {/* الملخص المالي */}
              {!loading && !error && (
                <>
                  <FinancialSummary 
                    totalAmount={totalAmount}
                    totalTransactions={totalEntries}
                  />
                  
                  {/* الرسوم البيانية */}
                  <FinancialCharts 
                    data={generateMonthlyReport(transactions)}
                  />

                  {/* قائمة الحركات المالية */}
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <TransactionList 
                      transactions={transactions}
                      onSort={sortTransactions}
                    />
                  </div>
                </>
              )}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// مكونات مساعدة
const FinancialLoading = () => (
  <div className="p-4 text-center text-gray-500">
    <div className="animate-spin inline-block w-6 h-6 border-2 border-current rounded-full" />
    <p className="mt-2">جاري تحميل البيانات المالية...</p>
  </div>
);

const FinancialError = ({ error }) => (
  <div className="p-4 bg-red-50 text-red-600 rounded-lg">
    <h3 className="font-bold">خطأ في تحميل البيانات!</h3>
    <p className="mt-2 text-sm">{error}</p>
  </div>
);