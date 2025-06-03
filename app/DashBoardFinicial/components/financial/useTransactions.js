// src/hooks/useTransactions.js
"use client";
import { useState, useEffect, useCallback } from "react";
import { mockTransactions } from "./mockTransactions";
import { formatDate, formatCurrency } from "@/utils/formatters";

export const useTransactions = (initialFilters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    transactionType: "all",
    status: "all",
    ...initialFilters,
  });

  const processData = useCallback((data) => {
    return data.map((trx) => ({
      ...trx,
      formattedDate: formatDate(trx.date),
      formattedAmount: formatCurrency(trx.amount, trx.currency),
      timestamp: new Date(trx.date).getTime(),
    }));
  }, []);

  const applyFilters = useCallback(
    (data) => {
      try {
        let filtered = [...data];

        if (filters.startDate) {
          const startTimestamp = new Date(filters.startDate).getTime();
          filtered = filtered.filter((trx) => trx.timestamp >= startTimestamp);
        }

        if (filters.endDate) {
          const endTimestamp = new Date(filters.endDate).getTime();
          filtered = filtered.filter((trx) => trx.timestamp <= endTimestamp);
        }

        if (filters.transactionType !== "all") {
          filtered = filtered.filter(
            (trx) => trx.type === filters.transactionType
          );
        }

        if (filters.status !== "all") {
          filtered = filtered.filter((trx) => trx.status === filters.status);
        }

        setFilteredTransactions(filtered);
      } catch {
        setError("حدث خطأ في تطبيق الفلاتر");
      }
    },
    [filters]
  );

  useEffect(() => {
    setLoading(true);
    try {
      const processedData = processData(mockTransactions);
      setTransactions(processedData);
      applyFilters(processedData);
    } catch {
      setError("خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, [processData, applyFilters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const addTransaction = useCallback(
    (newTrx) => {
      const transactionWithId = {
        ...newTrx,
        id: `TRX-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        timestamp: Date.now(),
      };

      setTransactions((prev) => processData([transactionWithId, ...prev]));
    },
    [processData]
  );

  const sortTransactions = useCallback((sortBy, order = "asc") => {
    setFilteredTransactions((prev) => {
      const sorted = [...prev].sort((a, b) => {
        if (sortBy === "date") return a.timestamp - b.timestamp;
        if (sortBy === "amount") return a.amount - b.amount;
        return 0;
      });

      return order === "asc" ? sorted : sorted.reverse();
    });
  }, []);

  useEffect(() => {
    applyFilters(transactions);
  }, [filters, transactions, applyFilters]);

  return {
    transactions: filteredTransactions,
    loading,
    error,
    addTransaction,
    sortTransactions,
    updateFilters,
    currentFilters: filters,
    totalEntries: filteredTransactions.length,
    totalAmount: filteredTransactions.reduce((sum, trx) => sum + trx.amount, 0),
  };
};
