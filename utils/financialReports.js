// src/utils/financialReports.js
export const generateMonthlyReport = (transactions) => {
  const monthlyData = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        totalIncome: 0,
        totalExpenses: 0,
        transactionsCount: 0,
      };
    }

    if (transaction.amount > 0) {
      monthlyData[monthYear].totalIncome += transaction.amount;
    } else {
      monthlyData[monthYear].totalExpenses += Math.abs(transaction.amount);
    }

    monthlyData[monthYear].transactionsCount++;
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data,
    netProfit: data.totalIncome - data.totalExpenses,
  }));
};
