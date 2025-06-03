import TransactionItem from './TransactionItem';
import { useTransactions } from './useTransactions';

export default function TransactionList() {
  const { transactions, loading, error } = useTransactions();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="transaction-list space-y-4">
      {transactions.map(transaction => (
        <TransactionItem 
          key={transaction.id} 
          {...transaction} 
        />
      ))}
    </div>
  );
}