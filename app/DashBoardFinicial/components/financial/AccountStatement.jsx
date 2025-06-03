'use client';
import { useFinancial } from './useFinancial';
import StatementHeader from './FinancialHeader';
import TransactionList from './TransactionList';

export default function AccountStatement({ userId, role }) {
  const { transactions, balance, loading } = useFinancial(userId, role);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <StatementHeader 
        title={`كشف حساب ${role === 'trainer' ? 'المدرب' : 'المتدرب'}`}
        balance={balance}
      />
      
      {loading ? (
        <div className="text-center py-8">جاري تحميل البيانات...</div>
      ) : (
        <TransactionList transactions={transactions} />
      )}
    </div>
  );
}