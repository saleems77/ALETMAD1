// AdDashboard.jsx
"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdDashboard = ({ campaigns = [], adSets = [], ads = [], advertiserAccounts = [] }) => {
  // Calculate statistics
  const stats = {
    campaigns: campaigns.length,
    adSets: adSets.length,
    ads: ads.length,
    advertiserAccounts: advertiserAccounts.length,
    totalBudget: campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.budget || 0), 0),
    activeCampaigns: campaigns.filter(c => c.status === 'active').length
  };

  // Prepare performance data
  const performanceData = [
    { name: 'الحملات', value: campaigns.length },
    { name: 'المجموعات', value: adSets.length },
    { name: 'الإعلانات', value: ads.length },
    { name: 'المعلنون', value: advertiserAccounts.length }
  ];

  // Prepare budget distribution data
  const budgetData = campaigns.map(campaign => ({
    name: campaign.title,
    budget: parseFloat(campaign.budget || 0)
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">لوحة تحكم الإعلانات</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">الحملات</p>
          <p className="text-2xl font-bold">{stats.campaigns}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="text-sm text-green-800">المجموعات</p>
          <p className="text-2xl font-bold">{stats.adSets}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <p className="text-sm text-purple-800">الإعلانات</p>
          <p className="text-2xl font-bold">{stats.ads}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <p className="text-sm text-yellow-800">إجمالي الميزانيات</p>
          <p className="text-2xl font-bold">{stats.totalBudget.toFixed(2)} ر.س</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <p className="text-sm text-red-800">الحملات النشطة</p>
          <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4">توزيع الميزانيات</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={budgetData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="budget" fill="#3B82F6" name="الميزانية (ر.س)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4">أداء النظام</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" name="العدد" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">آخر الحملات</h3>
          <div className="space-y-3">
            {campaigns.slice(0, 3).map((campaign, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{campaign.title}</p>
                  <p className="text-sm text-gray-500">
                    الميزانية: {campaign.budget} ر.س | الحالة: {campaign.status}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {new Date(campaign.startDate).toLocaleDateString('ar-SA')}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">نشاطات تحتاج اهتمام</h3>
          <div className="space-y-3">
            {campaigns
              .filter(c => c.status === 'pending')
              .slice(0, 3)
              .map((campaign, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <p>حملة <strong>{campaign.title}</strong> تحتاج مراجعة</p>
                </div>
              ))}
            {campaigns
              .filter(c => c.status === 'ended')
              .slice(0, 3)
              .map((campaign, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <p>حملة <strong>{campaign.title}</strong> منتهية</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDashboard;