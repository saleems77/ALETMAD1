// app/DashBoaredAdmin/components/communitycourse/CommunityDashboard.jsx
"use client";  
import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { getAdminData } from './mocks/communityData';
import { DataTable } from './DataTable';
import { useSearchParams, useRouter } from 'next/navigation';
import { HiOutlineSearch } from 'react-icons/hi';
import { BsFilter } from 'react-icons/bs';
import { useDebounce } from 'use-debounce';

// استيراد المكوّنات الثقيلة ديناميكيًا لتعطيل SSR داخليًا
const ModerationTools = dynamic(() => import('./ModerationTools'), { ssr: false });
const AnalyticsWidget  = dynamic(() => import('./AnalyticsWidget'),  { ssr: false });

export default function CommunityDashboard() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab]     = useState('users');
  const [searchTerm, setSearchTerm]   = useState(searchParams.get('q') || '');
  const [filters, setFilters]         = useState({});
  const [data, setData]               = useState(getAdminData());

  const [debouncedSearch] = useDebounce(searchTerm, 300);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    const list = data[activeTab] || [];
    return debouncedSearch
      ? list.filter(item =>
          Object.values(item)
            .some(val => String(val).toLowerCase()
              .includes(debouncedSearch.toLowerCase())
            )
        )
      : list;
  }, [data, activeTab, debouncedSearch]);

  const refreshData = useCallback(() => {
    setData(getAdminData());
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* أدوات البحث والفلترة */}
      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="ابحث..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setFilters({ status: 'active' })}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <BsFilter /> <span>فلترة النشطين</span>
          </button>
        </div>
        <button
          onClick={refreshData}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          تحديث البيانات
        </button>
      </div>

      {/* تبويبات */}
      <div className="tabs mb-6 bg-white rounded-lg p-2 shadow-sm">
        {['users','courses','discussions','reports'].map(tab => (
          <button
            key={tab}
            className={`tab tab-lg tab-lifted ${activeTab===tab?'tab-active':''}`}
            onClick={() => setActiveTab(tab)}
          >
            {{
              users:       'المستخدمين',
              courses:     'الدورات',
              discussions: 'المناقشات',
              reports:     'التقارير'
            }[tab]}
          </button>
        ))}
      </div>

      {/* محتوى كل تبويب */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {activeTab === 'users' && (
          <>
            <DataTable
              columns={[
                { header: 'الاسم', accessor: 'name' },
                { header: 'الدور', accessor: 'role' },
                { header: 'النشاط', accessor: 'activity' },
              ]}
              data={filteredData}
              onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
            />
            <ModerationTools />
          </>
        )}
        {activeTab === 'courses' && (
          <DataTable
            columns={[
              { header: 'العنوان', accessor: 'title' },
              { header: 'المدرب', accessor: 'instructor' },
              { header: 'المشاركون', accessor: 'participants' }
            ]}
            data={filteredData}
          />
        )}
        {activeTab === 'discussions' && (
          <div className="space-y-4">
            <AnalyticsWidget />
            <DataTable
              columns={[
                { header: 'العنوان', accessor: 'title' },
                { header: 'المشاركون', accessor: 'participants' },
                { header: 'آخر تحديث', accessor: 'lastUpdate' }
              ]}
              data={filteredData}
            />
          </div>
        )}
      </div>
    </div>
  );
}
