// app/dashboard/financial/useFinancial.js
import { useState, useEffect } from "react";
import { mockTransactions } from "./mockTransactions";

export const useFinancial = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // محاكاة جلب البيانات من API
    setTimeout(() => {
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1500);
  }, []);

  const applyFilters = (filters) => {
    // تطبيق الفلاتر على البيانات
    let filtered = [...mockTransactions];

    if (filters.startDate) {
      filtered = filtered.filter(
        (trx) => new Date(trx.date) >= new Date(filters.startDate)
      );
    }

    setTransactions(filtered);
  };

  return { transactions, isLoading, applyFilters };
};
