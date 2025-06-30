// AdvertiserAccountManager.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toastt";

const AdvertiserAccountManager = ({ accounts = [], onCreateAccount }) => {
  const [account, setAccount] = useState({
    businessName: "",
    timezone: "Asia/Riyadh",
    currency: "SAR"
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("jwt");
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/advertiser-accounts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            data: {
              ...account
            }
          })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "فشل إنشاء حساب المعلن");
      }
      
      const data = await response.json();
      
      // Reset form
      setAccount({
        businessName: "",
        timezone: "Asia/Riyadh",
        currency: "SAR"
      });
      
      toast({
        title: "🎉 تم الإنشاء!",
        description: "تم إنشاء حساب المعلن بنجاح"
      });
      
      onCreateAccount?.(data);
    } catch (error) {
      toast({
        title: "❌ خطأ",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">حسابات المعلنين</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">إنشاء حساب جديد</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">اسم المؤسسة *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={account.businessName}
              onChange={(e) => setAccount({...account, businessName: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">المنطقة الزمنية *</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={account.timezone}
                onChange={(e) => setAccount({...account, timezone: e.target.value})}
                required
              >
                <option value="Asia/Riyadh">الرياض (UTC+3)</option>
                <option value="Asia/Dubai">دبي (UTC+4)</option>
                <option value="Europe/London">لندن (UTC+1)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">العملة *</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={account.currency}
                onChange={(e) => setAccount({...account, currency: e.target.value})}
                required
              >
                <option value="SAR">ريال سعودي (ر.س)</option>
                <option value="USD">دولار أمريكي ($)</option>
                <option value="EUR">يورو (€)</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>
      </div>
      
      {accounts.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">حسابات المعلنين الحالية</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">اسم المؤسسة</th>
                  <th className="px-4 py-2 text-left">المنطقة الزمنية</th>
                  <th className="px-4 py-2 text-left">العملة</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{acc.businessName}</td>
                    <td className="px-4 py-2">{acc.timezone}</td>
                    <td className="px-4 py-2">{acc.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertiserAccountManager;