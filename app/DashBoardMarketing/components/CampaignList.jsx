// components/agent/Campaigns/CampaignList.jsx
'use client';
import { useState } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

// بيانات افتراضية موسعة
const campaignsData = [
  {
    id: 1,
    name: 'حملة الشتاء التعليمية',
    startDate: '2024-01-15',
    endDate: '2024-02-28',
    visits: 2450,
    clicks: 1580,
    conversions: 324,
    commission: 4860,
    status: 'نشطة'
  },
  {
    id: 2,
    name: 'عروض البرمجة المكثفة',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    visits: 1820,
    clicks: 920,
    conversions: 210,
    commission: 3150,
    status: 'منتهية'
  },
];

const CampaignCard = ({ campaign, onEdit, onDelete }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-semibold text-gray-800">{campaign.name}</h3>
      <span className={`px-3 py-1 rounded-full text-sm ${
        campaign.status === 'نشطة' 
          ? 'bg-green-100 text-green-700' 
          : 'bg-gray-100 text-gray-600'
      }`}>
        {campaign.status}
      </span>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <p className="text-gray-500 text-sm">الفترة</p>
        <p className="text-gray-700">
          {new Date(campaign.startDate).toLocaleDateString('ar-EG')} - 
          {new Date(campaign.endDate).toLocaleDateString('ar-EG')}
        </p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">العمولات</p>
        <p className="text-blue-600 font-medium">${campaign.commission.toLocaleString()}</p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-6">
      <StatBadge title="الزيارات" value={campaign.visits} color="bg-indigo-100" />
      <StatBadge title="النقرات" value={campaign.clicks} color="bg-green-100" />
      <StatBadge title="التحويلات" value={campaign.conversions} color="bg-purple-100" />
    </div>

    <div className="flex justify-end space-x-3">
      <button 
        onClick={() => onEdit(campaign)}
        className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
      >
        <PencilIcon className="w-5 h-5 mr-2" />
        تعديل
      </button>
      <button 
        onClick={() => onDelete(campaign.id)}
        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
      >
        <TrashIcon className="w-5 h-5 mr-2" />
        حذف
      </button>
    </div>
  </div>
);

const StatBadge = ({ title, value, color }) => (
  <div className={`${color} p-3 rounded-lg text-center`}>
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-lg font-semibold text-gray-800">{value.toLocaleString()}</p>
  </div>
);

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState(campaignsData);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const handleDelete = (id) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
  };

  const handleEdit = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">قائمة الحملات التسويقية</h2>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          حملة جديدة
        </button>
      </div>

      {/* العرض كبطاقات للشاشات الصغيرة */}
      <div className="lg:hidden space-y-4">
        {campaigns.map(campaign => (
          <CampaignCard 
            key={campaign.id}
            campaign={campaign}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* العرض كجدول للشاشات الكبيرة */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">اسم الحملة</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">الفترة</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">الزيارات</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">النقرات</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">التحويلات</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">العمولات</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">الحالة</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map(campaign => (
              <tr key={campaign.id}>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{campaign.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(campaign.startDate).toLocaleDateString('ar-EG')} - 
                  {new Date(campaign.endDate).toLocaleDateString('ar-EG')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{campaign.visits.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{campaign.clicks.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{campaign.conversions.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-blue-600 font-medium">${campaign.commission.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    campaign.status === 'نشطة' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-3">
                  <button 
                    onClick={() => handleEdit(campaign)}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(campaign.id)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}