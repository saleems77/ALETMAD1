'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function TransactionHistory({ transactions }) {
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = transactions.filter(t => 
    filterType === 'all' ? true : t.type === filterType
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <select 
          className="p-2 border rounded-lg"
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">جميع المعاملات</option>
          <option value="income">الإيرادات</option>
          <option value="expense">المصروفات</option>
        </select>
        
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
          <ArrowDownTrayIcon className="w-5 h-5" />
          تصدير إلى Excel
        </button>
      </div>

      {filteredTransactions.map(transaction => (
        <TransactionItem key={transaction.id} {...transaction} />
      ))}
    </div>
  );
}