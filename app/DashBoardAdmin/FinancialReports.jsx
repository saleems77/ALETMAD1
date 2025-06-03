"use client";
import React, { useState, useEffect } from "react";
import { utils, writeFile } from "xlsx";
import {
  FiFilter,
  FiX,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiDownload,
  FiSave,
} from "react-icons/fi";
import { toast } from "react-toastify";

// بيانات أولية
const INITIAL_DATA = [
  {
    id: 1,
    date: "2024-03-01",
    type: "إيراد",
    amount: 15000,
    currency: "ر.س",
    category: "الاشتراكات",
    status: "مكتمل",
    description: "اشتراك سنوي",
  },
  {
    id: 2,
    date: "2024-03-05",
    type: "مصروف",
    amount: 5000,
    currency: "ر.س",
    category: "التسويق",
    status: "معلق",
    description: "حملة إعلانية",
  },
  {
    id: 3,
    date: "2024-03-10",
    type: "إيراد",
    amount: 8000,
    currency: "ر.س",
    category: "الدورات",
    status: "مكتمل",
    description: "دورة متقدمة",
  },
];

// مكون مودال مخصص
const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">إدارة العملية المالية</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const FinancialReports = () => {
  const [transactions, setTransactions] = useState(INITIAL_DATA);
  const [filteredData, setFilteredData] = useState(INITIAL_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  // الحقول المتاحة
  const categories = [...new Set(INITIAL_DATA.map((t) => t.category))];
  const statuses = ["مكتمل", "معلق"];
  const types = ["إيراد", "مصروف"];

  useEffect(() => {
    applyFilters();
  }, [filters, transactions]);

  const applyFilters = () => {
    let result = [...transactions];

    if (filters.type) result = result.filter((t) => t.type === filters.type);
    if (filters.status)
      result = result.filter((t) => t.status === filters.status);
    if (filters.category)
      result = result.filter((t) => t.category === filters.category);
    if (filters.startDate)
      result = result.filter(
        (t) => new Date(t.date) >= new Date(filters.startDate)
      );
    if (filters.endDate)
      result = result.filter(
        (t) => new Date(t.date) <= new Date(filters.endDate)
      );

    setFilteredData(result);
  };

  const handleExportExcel = () => {
    const ws = utils.json_to_sheet(filteredData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "العمليات المالية");
    writeFile(wb, "العمليات_المالية.xlsx");
    toast.success("تم التصدير إلى Excel بنجاح");
  };

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه العملية؟")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success("تم حذف العملية بنجاح");
    }
  };

  const handleSubmit = (formData) => {
    if (formData.id) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === formData.id ? formData : t))
      );
      toast.success("تم تحديث العملية بنجاح");
    } else {
      const newTransaction = {
        ...formData,
        id: Date.now(),
      };
      setTransactions((prev) => [...prev, newTransaction]);
      toast.success("تم إضافة العملية بنجاح");
    }
    setIsModalOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      type: "",
      status: "",
      category: "",
      startDate: "",
      endDate: "",
    });
  };

  const stats = {
    totalIncome: filteredData
      .filter((t) => t.type === "إيراد")
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: filteredData
      .filter((t) => t.type === "مصروف")
      .reduce((sum, t) => sum + t.amount, 0),
    netProfit: function () {
      return this.totalIncome - this.totalExpenses;
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* شريط العنوان والأزرار */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">التقارير المالية</h2>
          <p className="text-gray-600">إدارة كاملة للعمليات المالية</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              setEditingTransaction(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 flex-1 md:flex-none justify-center"
          >
            <FiPlus /> إضافة عملية
          </button>

          <button
            onClick={handleExportExcel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <FiDownload /> تصدير Excel
          </button>
        </div>
      </div>

      {/* فلاتر البحث */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <select
            className="p-2 rounded border border-gray-300 bg-white"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">كل الأنواع</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            className="p-2 rounded border border-gray-300 bg-white"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">كل الحالات</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            className="p-2 rounded border border-gray-300 bg-white"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">كل الفئات</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="p-2 rounded border border-gray-300 bg-white"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />

          <input
            type="date"
            className="p-2 rounded border border-gray-300 bg-white"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />

          <button
            onClick={resetFilters}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded border border-gray-300"
          >
            <FiFilter className="inline mr-1" /> إعادة الضبط
          </button>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-gray-600">الإيرادات</p>
          <p className="text-2xl font-bold text-blue-600">
            {stats.totalIncome.toLocaleString()} ر.س
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <p className="text-gray-600">المصروفات</p>
          <p className="text-2xl font-bold text-red-600">
            {stats.totalExpenses.toLocaleString()} ر.س
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="text-gray-600">صافي الربح</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.netProfit().toLocaleString()} ر.س
          </p>
        </div>
      </div>

      {/* جدول العمليات */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التاريخ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                النوع
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المبلغ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الفئة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الوصف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.type === "إيراد"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.amount.toLocaleString()} {transaction.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === "مكتمل"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate"
                    title={transaction.description}
                  >
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingTransaction(transaction);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="تعديل"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                        title="حذف"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  لا توجد بيانات متاحة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* مودال الإضافة/التعديل */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
      >
        <TransactionForm
          initialData={editingTransaction || {}}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
          categories={categories}
        />
      </CustomModal>
    </div>
  );
};

// مكون النموذج
const TransactionForm = ({ initialData, onSubmit, onCancel, categories }) => {
  const [formData, setFormData] = useState({
    date: initialData.date || new Date().toISOString().split("T")[0],
    type: initialData.type || "إيراد",
    amount: initialData.amount || "",
    category: initialData.category || "",
    status: initialData.status || "مكتمل",
    description: initialData.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: initialData.id,
      currency: "ر.س",
      amount: Number(formData.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            التاريخ
          </label>
          <input
            type="date"
            name="date"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            النوع
          </label>
          <select
            name="type"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="إيراد">إيراد</option>
            <option value="مصروف">مصروف</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المبلغ (ر.س)
          </label>
          <input
            type="number"
            name="amount"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الفئة
          </label>
          <select
            name="category"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">اختر الفئة</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الحالة
          </label>
          <select
            name="status"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="مكتمل">مكتمل</option>
            <option value="معلق">معلق</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الوصف (اختياري)
          </label>
          <textarea
            name="description"
            rows="3"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-1"
          >
            <FiSave /> حفظ
          </button>
        </div>
      </div>
    </form>
  );
};

export default FinancialReports;