'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from './components/Sidebar';
import SummaryCard from './components/SummaryCard';
import FinancialManager from './components/FinancialManager';

import FinancialDashboard from './components/financial/page';
import PayoutsPage from './components/Payouts/page';
import RefundDashboard from './components/Refunds/page';
import CouponDashboard from './components/coupons/page';
import OffersPage from './components/Offers/page';

const page = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // بيانات مؤشرات الأداء
  const kpiData = {
    openTickets: 24,
    responseRate: '89%',
    dailyRevenue: '2,450 ر.س',
    monthlyRevenue: '68,900 ر.س'
  };

  // بيانات الرسم البياني
  const financialData = [
    { month: 'يناير', revenue: 24000, tickets: 45 },
    { month: 'فبراير', revenue: 45670, tickets: 78 },
    { month: 'مارس', revenue: 32450, tickets: 56 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
     
      
      <div className="flex pt-16">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sections={{
            dashboard: 'الاحصائيات',
            finance: 'المالية',
            voip: '   إدارة المكالمات  VOIP',

          }}
        />

        <main className="flex-1 mr-64 p-8">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* بطاقات المؤشرات */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                  title="التذاكر المفتوحة"
                  value={kpiData.openTickets}
                  trend="up"
                  color="blue"
                />
                <SummaryCard
                  title="معدل الاستجابة"
                  value={kpiData.responseRate}
                  trend="neutral"
                  color="purple"
                />
                <SummaryCard
                  title="إيرادات اليوم"
                  value={kpiData.dailyRevenue}
                  trend="up"
                  color="green"
                />
                <SummaryCard
                  title="إيرادات الشهر"
                  value={kpiData.monthlyRevenue}
                  trend="down"
                  color="orange"
                />
              </div>

              {/* الرسوم البيانية */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">الأداء الشهري</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#3B82F6" name="الإيرادات" />
                      <Bar dataKey="tickets" fill="#10B981" name="عدد التذاكر" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'dashboard' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">التقارير المالية</h2>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#6366F1" name="الإيرادات الشهرية" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
           {/* Finance Section */}
                    
                    {/* content Section */}
                    {activeSection === 'content' && (
                      <div className="bg-white p-6 rounded-lg shadow-sm">
                    {activeSection === 'content' && <FinancialManager />}
                    </div>
                    )}
                    {/* support Section */}
                    
                    {/* user Section */}
                    
                                    {activeSection === 'payouts' && <PayoutsPage   />}
                                    {activeSection === 'myfinance' && <FinancialDashboard   />}
                                    {activeSection === 'refunds' && <RefundDashboard   />}
                                    {activeSection === 'copon' && <CouponDashboard   />}
                                    {activeSection === 'offers' && <OffersPage   />}

                    
        </main>
      </div>
    </div>
  );
};

export default page;