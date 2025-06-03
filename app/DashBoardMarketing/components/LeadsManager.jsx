'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  TagIcon,
  UserCircleIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChartBarIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition, Dialog } from '@headlessui/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const initialLeads = [
  {
    id: 1,
    name: 'محمد أحمد',
    email: 'mohamed@example.com',
    phone: '+966512345678',
    education: 'بكالوريوس علوم حاسب',
    specialty: 'تطوير الويب',
    interests: ['React.js', 'Node.js', 'الذكاء الاصطناعي'],
    stage: 'مهتم',
    tags: ['دورات برمجة', 'ميزانية محددة'],
    notes: [],
    lastContact: '2024-03-15',
    campaignIds: [],
    rating: 4
  },
  {
    id: 2,
    name: 'فاطمة سالم',
    email: 'fatima@example.com',
    phone: '+966511112222',
    education: 'ماجستير تصميم جرافيك',
    specialty: 'UI/UX Design',
    interests: ['Figma', 'Adobe XD', 'التصميم التفاعلي'],
    stage: 'متابعة',
    tags: ['ورش تصميم', 'عروض خاصة'],
    notes: ['طلب معلومات إضافية عن الباقات'],
    lastContact: '2024-03-20',
    campaignIds: [1],
    rating: 3
  }
];

const stageColors = {
  مهتم: 'bg-blue-100 text-blue-800',
  متابعة: 'bg-yellow-100 text-yellow-800',
  مفاوضات: 'bg-purple-100 text-purple-800',
  مغلق: 'bg-green-100 text-green-800'
};

const LeadRow = ({
  lead,
  campaigns,
  onTagUpdate,
  onNoteAdd,
  onCampaignToggle,
  isSelected,
  onToggleSelect
}) => {
  const [newNote, setNewNote] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group ${isSelected ? 'border-blue-500' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3 w-full">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="h-5 w-5 text-blue-600 rounded"
          />
          <UserCircleIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{lead.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${i < lead.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 transition-colors"
        >
          {isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-2">
          <AcademicCapIcon className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600 text-sm">{lead.education}</span>
        </div>
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600 text-sm">{lead.specialty}</span>
        </div>
        <div className="flex items-center gap-2">
          <TagIcon className="w-5 h-5 text-gray-500" />
          <div className="flex flex-wrap gap-1">
            {lead.interests.slice(0, 2).map((interest, i) => (
              <span key={i} className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                {interest}
              </span>
            ))}
            {lead.interests.length > 2 && (
              <span className="text-gray-400 text-xs">+{lead.interests.length - 2}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {campaigns
            .filter(c => lead.campaignIds.includes(c.id))
            .map(c => (
              <span key={c.id} className="bg-blue-100 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                {c.name}
              </span>
            ))}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 border-t border-gray-100 pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <EnvelopeIcon className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                <p className="text-gray-800">{lead.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <PhoneIcon className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">رقم الجوال</p>
                <p className="text-gray-800">{lead.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-700">الإجراءات السريعة</h4>
              <div className="flex gap-3">
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg bg-gray-100">
                    <TagIcon className="w-5 h-5" />
                    <span className="mr-1 text-sm">إدارة التاجات</span>
                  </Menu.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Menu.Items className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border focus:outline-none z-10">
                      {['دورات جديدة', 'عميل VIP', 'متابعة أسبوعية'].map((tag) => (
                        <Menu.Item key={tag}>
                          <button
                            onClick={() => onTagUpdate(lead.id, tag)}
                            className="w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {tag}
                          </button>
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
                <button 
                  className="flex items-center text-gray-600 hover:text-green-600 px-3 py-1.5 rounded-lg bg-gray-100"
                  onClick={() => window.open(`mailto:${lead.email}?subject=عرض خاص`, '_blank')}
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  <span className="mr-1 text-sm">إرسال عرض</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="أضف ملاحظة جديدة..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  if (newNote.trim()) {
                    onNoteAdd(lead.id, newNote);
                    setNewNote('');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                حفظ الملاحظة
              </button>
            </div>

            <div className="space-y-2">
              {lead.notes.map((note, index) => (
                <div key={index} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                  <ChatBubbleLeftIcon className="w-5 h-5 text-gray-400 mt-1" />
                  <p className="text-gray-600 text-sm">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CampaignChart = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold mb-4">توزيع العملاء حسب الحملات</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="campaign" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const CampaignModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
          <Dialog.Title className="text-xl font-bold">إنشاء حملة جديدة</Dialog.Title>
          <input 
            type="text"
            placeholder="اسم الحملة"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <textarea
            placeholder="وصف الحملة"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">
              إلغاء
            </button>
            <button 
              onClick={() => onCreate({ name, description })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              إنشاء
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default function LeadsManager() {
  const [leads, setLeads] = useState(initialLeads);
  const [campaigns, setCampaigns] = useState([{ id: 1, name: 'الحملة الافتتاحية', description: 'عرض خاص للعملاء الجدد' }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    stage: '',
    specialty: '',
    rating: '',
    campaignId: ''
  });
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  const chartData = useMemo(() => {
    const campaignCounts = leads.reduce((acc, lead) => {
      lead.campaignIds.forEach(campaignId => {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (campaign) {
          acc[campaign.name] = (acc[campaign.name] || 0) + 1;
        }
      });
      return acc;
    }, {});

    return Object.entries(campaignCounts).map(([campaign, count]) => ({
      campaign,
      count
    }));
  }, [leads, campaigns]);

  const filteredLeads = useMemo(() => 
    leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()));
        
      const matchesStage = selectedFilters.stage ? lead.stage === selectedFilters.stage : true;
      const matchesSpecialty = selectedFilters.specialty ? lead.specialty === selectedFilters.specialty : true;
      const matchesRating = selectedFilters.rating ? lead.rating >= parseInt(selectedFilters.rating) : true;
      const matchesCampaign = selectedFilters.campaignId 
        ? lead.campaignIds.includes(parseInt(selectedFilters.campaignId)) 
        : true;

      return matchesSearch && matchesStage && matchesSpecialty && matchesRating && matchesCampaign;
    }), 
  [leads, searchQuery, selectedFilters]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAssignCampaign = () => {
    if (!selectedCampaign) return;
    
    setLeads(leads.map(lead => 
      selectedLeadIds.includes(lead.id)
        ? { 
            ...lead, 
            campaignIds: [...new Set([...lead.campaignIds, parseInt(selectedCampaign)])]
          }
        : lead
    ));
    
    setSelectedLeadIds([]);
    setSelectedCampaign('');
  };

  const handleCreateCampaign = (newCampaign) => {
    const newCampaignWithId = {
      id: Date.now(),
      ...newCampaign
    };
    setCampaigns([...campaigns, newCampaignWithId]);
    setIsCampaignModalOpen(false);
  };

  const exportData = () => {
    const csvContent = [
      ['الاسم', 'البريد الإلكتروني', 'التخصص', 'التقييم', 'الحالة', 'الحملات'],
      ...filteredLeads.map(lead => [
        lead.name,
        lead.email,
        lead.specialty,
        lead.rating,
        lead.stage,
        campaigns
          .filter(c => lead.campaignIds.includes(c.id))
          .map(c => c.name)
          .join(', ')
      ])
    ].map(e => e.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'العملاء-المحتملين.csv';
    link.click();
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">إدارة العملاء المحتملين</h2>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="ابحث عن عميل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>تصدير البيانات</span>
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <select
              value={selectedFilters.stage}
              onChange={(e) => handleFilterChange('stage', e.target.value)}
              className="bg-transparent w-full focus:outline-none"
            >
              <option value="">جميع الحالات</option>
              {Object.keys(stageColors).map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
            <BriefcaseIcon className="w-5 h-5 text-gray-500" />
            <select
              value={selectedFilters.specialty}
              onChange={(e) => handleFilterChange('specialty', e.target.value)}
              className="bg-transparent w-full focus:outline-none"
            >
              <option value="">جميع التخصصات</option>
              {[...new Set(leads.map(lead => lead.specialty))].map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
            <StarIcon className="w-5 h-5 text-gray-500" />
            <select
              value={selectedFilters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="bg-transparent w-full focus:outline-none"
            >
              <option value="">جميع التقييمات</option>
              {[3, 4, 5].map(rating => (
                <option key={rating} value={rating}>{rating}+ نجوم</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
            <TagIcon className="w-5 h-5 text-gray-500" />
            <select
              value={selectedFilters.campaignId}
              onChange={(e) => handleFilterChange('campaignId', e.target.value)}
              className="bg-transparent w-full focus:outline-none"
            >
              <option value="">جميع الحملات</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">اختر حملة</option>
            {campaigns.map(campaign => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
          <button 
            onClick={handleAssignCampaign}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            إضافة إلى الحملة
          </button>
          <button 
            onClick={() => setIsCampaignModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            إنشاء حملة جديدة
          </button>
        </div>
      </div>

      <CampaignChart data={chartData} />

      <div className="space-y-4">
        {filteredLeads.map(lead => (
          <LeadRow
            key={lead.id}
            lead={lead}
            campaigns={campaigns}
            onTagUpdate={(id, tag) => 
              setLeads(leads.map(l => 
                l.id === id 
                  ? { ...l, tags: Array.from(new Set([...l.tags, tag])) } 
                  : l
              ))
            }
            onNoteAdd={(id, note) => 
              setLeads(leads.map(l => 
                l.id === id 
                  ? { ...l, notes: [...l.notes, note] } 
                  : l
              ))
            }
            onCampaignToggle={(id, campaignId) => 
              setLeads(leads.map(l => 
                l.id === id 
                  ? { 
                      ...l, 
                      campaignIds: l.campaignIds.includes(campaignId)
                        ? l.campaignIds.filter(cid => cid !== campaignId)
                        : [...l.campaignIds, campaignId]
                    } 
                  : l
              ))
            }
            isSelected={selectedLeadIds.includes(lead.id)}
            onToggleSelect={() => setSelectedLeadIds(prev => 
              prev.includes(lead.id)
                ? prev.filter(id => id !== lead.id)
                : [...prev, lead.id]
            )}
          />
        ))}
      </div>

      <CampaignModal 
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        onCreate={handleCreateCampaign}
      />
    </div>
  );
}