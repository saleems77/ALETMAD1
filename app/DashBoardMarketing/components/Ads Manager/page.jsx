"use client"
import { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { 
  ArrowTrendingUpIcon,
  UserGroupIcon,
  PlusIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
  MegaphoneIcon,
  PhotoIcon,
  CreditCardIcon,
  ChartPieIcon,
  FunnelIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  CalendarIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const COLORS = {
  primary: { 
    main: '#008DCB',
    light: '#E6F4FF',
    dark: '#006699',
    gradient: 'linear-gradient(135deg, #008DCB 0%, #006699 100%)'
  },
  secondary: {
    main: '#0D1012',
    light: '#2D3748',
    dark: '#000000'
  },
  success: {
    main: '#48BB78',
    light: '#EBF8F2'
  },
  warning: {
    main: '#ECC94B',
    light: '#FEFCBF'
  },
  error: {
    main: '#F56565',
    light: '#FEE2E2'
  },
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  text: {
    primary: '#2D3748',
    secondary: '#718096',
    inverted: '#FFFFFF'
  },
  social: {
    facebook: '#1877F2',
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    linkedin: '#0A66C2'
  }
};

const DEMO_ACCOUNT = {
  name: 'الحساب الرئيسي',
  balance: 15000,
  currency: 'SAR',
  platforms: ['meta', 'google', 'tiktok']
};

const SOCIAL_PLATFORMS = [
  { value: 'facebook', label: 'فيسبوك', icon: 'https://static.vecteezy.com/system/resources/previews/018/930/476/non_2x/facebook-logo-facebook-icon-transparent-free-png.png' },
  { value: 'instagram', label: 'إنستجرام', icon: 'https://png.pngtree.com/png-clipart/20230401/original/pngtree-three-dimensional-instagram-icon-png-image_9015419.png' },
  { value: 'twitter', label: 'تويتر', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYHDhjypgRklncOY5oZJLLQ3TysrcwWN4gfg&s' },
  { value: 'linkedin', label: 'لينكدإن', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlh2DiY-UY_24sTF_1-yecTQI275oFKmBKxg&s' }
];

const SHARING_PLATFORMS = [
  { 
    value: 'meta-ads', 
    label: 'إدارة إعلانات ميتا', 
    icon: 'https://static.vecteezy.com/system/resources/previews/046/861/643/non_2x/meta-icon-transparent-background-free-png.png',
    url: (campaign) => `https://www.facebook.com/adsmanager/create/campaign?name=${encodeURIComponent(campaign.name)}`
  },
  {
    value: 'facebook',
    label: 'فيسبوك',
    icon: 'https://static.vecteezy.com/system/resources/previews/018/930/476/non_2x/facebook-logo-facebook-icon-transparent-free-png.png',
    url: (campaign) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
  },
  {
    value: 'whatsapp',
    label: 'واتساب',
    icon: 'https://www.iconpacks.net/icons/2/free-whatsapp-logo-icon-4456-thumb.png',
    url: (campaign) => `https://api.whatsapp.com/send?text=${encodeURIComponent(`حملة إعلانية: ${campaign.name}\n${window.location.href}`)}`
  },
  {
    value: 'instagram',
    label: 'إنستجرام',
    icon: 'https://png.pngtree.com/png-clipart/20230401/original/pngtree-three-dimensional-instagram-icon-png-image_9015419.png',
    url: (campaign) => `https://www.instagram.com/create/story?content=${encodeURIComponent(campaign.content)}`
  },
  {
    value: 'twitter',
    label: 'تويتر',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYHDhjypgRklncOY5oZJLLQ3TysrcwWN4gfg&s',
    url: (campaign) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(`حملة إعلانية: ${campaign.name}\n${window.location.href}`)}`
  },
];

const AdvancedAdsManager = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [budgetAllocation, setBudgetAllocation] = useState([
    { platform: 'meta', percentage: 60 },
    { platform: 'google', percentage: 30 },
    { platform: 'tiktok', percentage: 10 }
  ]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [scheduleDate, setScheduleDate] = useState(new Date());

  const mockAnalytics = {
    impressions: { current: 24567, change: +12 },
    clicks: { current: 3456, change: -4 },
    ctr: { current: 2.4, change: +0.3 },
    conversions: { current: 234, change: +18 }
  };

  const handleMetaLogin = (response) => {
    setMetaData(response);
    toast.success('تم الربط مع حساب ميتا بنجاح');
  };

  const connectAccount = async (platform) => {
    const newAccount = {
      id: Math.random().toString(36).substr(2, 9),
      platform,
      username: `account_${Math.random().toString(36).substr(2, 5)}`,
      connectedAt: new Date().toISOString(),
      stats: {
        followers: Math.floor(Math.random() * 10000),
        engagement: Math.random().toFixed(2)
      }
    };
    setConnectedAccounts([...connectedAccounts, newAccount]);
    toast.success(`تم ربط حساب ${platform} بنجاح`);
  };

  const handleCreateCampaign = (newCampaign) => {
    const campaign = {
      id: Math.random().toString(36).substr(2, 9),
      ...newCampaign,
      status: 'active',
      createdAt: new Date().toISOString(),
      stats: {
        clicks: Math.floor(Math.random() * 1000),
        impressions: Math.floor(Math.random() * 10000),
        spend: Math.floor(Math.random() * 5000),
        ctr: (Math.random() * 10).toFixed(2)
      }
    };
    setCampaigns([...campaigns, campaign]);
    toast.success('تم إنشاء الحملة بنجاح!');
  };

  const CampaignCard = ({ campaign }) => {
    const [showSharingOptions, setShowSharingOptions] = useState(false);

    const handleShare = (platform) => {
      const shareUrl = platform.url(campaign);
      window.open(shareUrl, '_blank');
      setShowSharingOptions(false);
    };

    return (
      <motion.div 
        className="p-6 rounded-2xl bg-surface shadow-surfaces hover:shadow-lg transition-all relative"
        whileHover={{ y: -5 }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{campaign.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-sm 
                ${campaign.status === 'active' ? 'bg-success-light text-success-main' : 'bg-error-light text-error-main'}`}>
                {campaign.status === 'active' ? 'نشطة' : 'متوقفة'}
              </span>
              <span className="text-sm text-text-secondary">
                {campaign.budget} {DEMO_ACCOUNT.currency}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowSharingOptions(!showSharingOptions)}
                className="p-2 hover:bg-background rounded-lg"
              >
                <ArrowUpTrayIcon className="h-5 w-5 text-text-secondary" />
              </button>
              
              <AnimatePresence>
                {showSharingOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-lg shadow-lg z-20"
                  >
                    {SHARING_PLATFORMS.map((platform) => (
                      <button
                        key={platform.value}
                        onClick={() => handleShare(platform)}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-background text-text-primary text-sm text-right"
                      >
                        <img 
                          src={platform.icon} 
                          alt={platform.label} 
                          className="h-5 w-5 object-contain"
                        />
                        <span className="flex-1">{platform.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={() => setSelectedCampaign(campaign)}
              className="p-2 hover:bg-background rounded-lg"
            >
              <Cog6ToothIcon className="h-5 w-5 text-text-secondary" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ArrowTrendingUpIcon className="h-4 w-4 text-success-main" />
              <span className="text-sm text-text-primary">{campaign.stats.clicks.toLocaleString()} نقرات</span>
            </div>
            <div className="flex items-center gap-2">
              <GlobeAltIcon className="h-4 w-4 text-primary-main" />
              <span className="text-sm text-text-primary">{campaign.stats.impressions.toLocaleString()} ظهور</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCardIcon className="h-4 w-4 text-warning-main" />
              <span className="text-sm text-text-primary">{campaign.stats.spend?.toLocaleString()} إنفاق</span>
            </div>
            <div className="flex items-center gap-2">
              <ChartPieIcon className="h-4 w-4 text-secondary-main" />
              <span className="text-sm text-text-primary">{campaign.stats.ctr}% CTR</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <motion.div 
        className="fixed top-0 left-0 h-full w-80 p-6 z-50"
        style={{ 
          background: COLORS.primary.gradient,
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
          borderRight: `1px solid ${COLORS.border}`
        }}
      >
        <div className="flex items-center gap-3 mb-10">
          <MegaphoneIcon className="h-8 w-8 text-surface" />
          <h1 className="text-2xl font-bold text-surface">Ads Manager Pro</h1>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', icon: ChartBarIcon, label: 'اللوحة الرئيسية' },
            { id: 'campaigns', icon: MegaphoneIcon, label: 'الحملات' },
            { id: 'audience', icon: UserGroupIcon, label: 'الجمهور' },
            { id: 'creatives', icon: PhotoIcon, label: 'الإعلانات' },
            { id: 'analytics', icon: ArrowTrendingUpIcon, label: 'الأداء' },
            { id: 'billing', icon: CreditCardIcon, label: 'الفوترة' }
          ].map((item) => (
            <motion.button
              key={item.id}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all
                ${activeTab === item.id ? 'bg-surface/20 text-surface' : 'hover:bg-surface/10 text-surface/80'}`}
              whileHover={{ x: 5 }}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-surface/20">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h3 className="font-medium text-surface">{DEMO_ACCOUNT.name}</h3>
              <p className="text-sm text-surface/80">
                {DEMO_ACCOUNT.balance.toLocaleString()} {DEMO_ACCOUNT.currency}
              </p>
            </div>
            <button className="p-2 hover:bg-surface/10 rounded-lg">
              <Cog6ToothIcon className="h-5 w-5 text-surface/80" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="ml-80 p-8">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-text-primary">
              {{
                dashboard: 'اللوحة الرئيسية',
                campaigns: 'إدارة الحملات',
                audience: 'تحليلات الجمهور',
                creatives: 'إدارة الإعلانات',
                analytics: 'تقارير الأداء',
                billing: 'إدارة الفوترة'
              }[activeTab]}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              آخر تحديث: {new Date().toLocaleDateString()}
            </p>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <MetaLoginButton onLoginSuccess={handleMetaLogin} />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl flex items-center gap-2 bg-primary-main text-surface
                hover:bg-primary-dark shadow-lg transition-all"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusIcon className="h-5 w-5" />
              حملة جديدة
            </motion.button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(mockAnalytics).map(([key, metric]) => (
                <motion.div
                  key={key}
                  className="p-6 rounded-2xl bg-surface shadow-surfaces"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-2">{key}</p>
                      <p className="text-3xl font-bold text-text-primary">
                        {metric.current.toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${metric.change > 0 ? 'bg-success-light' : 'bg-error-light'}`}>
                      <ArrowTrendingUpIcon className={`h-6 w-6 ${metric.change > 0 ? 'text-success-main' : 'text-error-main'}`} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`text-sm font-medium ${metric.change > 0 ? 'text-success-main' : 'text-error-main'}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                    <span className="text-sm text-text-secondary">الشهر الماضي</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-surface shadow-surfaces">
                <h3 className="text-lg font-semibold text-text-primary mb-4">توزيع الميزانية</h3>
                <Pie
                  data={{
                    labels: budgetAllocation.map(item => item.platform),
                    datasets: [{
                      data: budgetAllocation.map(item => item.percentage),
                      backgroundColor: [
                        COLORS.social.facebook,
                        COLORS.social.instagram,
                        COLORS.social.twitter
                      ],
                      borderWidth: 2
                    }]
                  }}
                  options={{
                    plugins: {
                      legend: {
                        labels: { 
                          color: COLORS.text.primary,
                          font: {
                            family: 'inherit'
                          }
                        }
                      }
                    }
                  }}
                />
              </div>

              <div className="p-6 rounded-2xl bg-surface shadow-surfaces">
                <h3 className="text-lg font-semibold text-text-primary mb-4">أداء الحملات</h3>
                <Line
                  data={{
                    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                    datasets: [{
                      label: 'الإنفاق',
                      data: [12000, 19000, 3000, 5000, 2000, 3000],
                      borderColor: COLORS.primary.main,
                      backgroundColor: COLORS.primary.light,
                      tension: 0.4,
                      fill: true
                    }, {
                      label: 'العوائد',
                      data: [18000, 28000, 6500, 9000, 4500, 10000],
                      borderColor: COLORS.success.main,
                      backgroundColor: COLORS.success.light,
                      tension: 0.4,
                      fill: true
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: { color: COLORS.text.primary }
                      }
                    },
                    scales: {
                      x: {
                        grid: { color: COLORS.border },
                        ticks: { color: COLORS.text.secondary }
                      },
                      y: {
                        grid: { color: COLORS.border },
                        ticks: { color: COLORS.text.secondary }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}

        <AnimatePresence>
          {isModalOpen && (
            <CampaignCreationModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)}
              onCreate={handleCreateCampaign}
              connectedAccounts={connectedAccounts}
              connectAccount={connectAccount}
              scheduleDate={scheduleDate}
              setScheduleDate={setScheduleDate}
            />
          )}
        </AnimatePresence>
      </div>

      <ToastContainer 
        position="bottom-left"
        toastStyle={{
          background: COLORS.surface,
          color: COLORS.text.primary,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      />

      <style jsx global>{`
        .shadow-surfaces {
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
          transition: box-shadow 0.3s ease;
        }
        
        .shadow-surfaces:hover {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

const CampaignCreationModal = ({ 
  isOpen, 
  onClose, 
  onCreate,
  connectedAccounts,
  connectAccount,
  scheduleDate,
  setScheduleDate
}) => {
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    platforms: [],
    budget: '',
    scheduleType: 'now',
    targetAudience: { age: [18, 65], locations: [], interests: [] },
    attachments: []
  });

  const handleSubmit = () => {
    onCreate({
      ...formData,
      scheduleDate: formData.scheduleType === 'schedule' ? scheduleDate : null
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl w-full max-w-2xl bg-surface shadow-surfaces"
          >
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-text-primary">إنشاء حملة جديدة</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-background rounded-lg"
              >
                <XMarkIcon className="h-6 w-6 text-text-secondary" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {SOCIAL_PLATFORMS.map((platform) => (
                  <div 
                    key={platform.value}
                    className="flex items-center justify-between p-4 bg-background rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img src={platform.icon} alt={platform.label} className="h-8 w-8" />
                      <span className="text-text-primary">{platform.label}</span>
                    </div>
                    <button
                      onClick={() => connectAccount(platform.value)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        connectedAccounts.some(acc => acc.platform === platform.value)
                          ? 'bg-primary-light text-primary-main'
                          : 'bg-surface text-text-primary border border-border hover:bg-background'
                      }`}
                    >
                      {connectedAccounts.some(acc => acc.platform === platform.value) ? 'متصل' : 'ربط'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">اسم الحملة</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-main"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">الميزانية (SAR)</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-main"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">المحتوى</label>
                  <textarea
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-main h-32"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">الجدولة</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="now"
                        checked={formData.scheduleType === 'now'}
                        onChange={() => setFormData({...formData, scheduleType: 'now'})}
                        className="text-primary-main focus:ring-primary-main"
                      />
                      <span className="text-text-primary">نشر فوري</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="schedule"
                        checked={formData.scheduleType === 'schedule'}
                        onChange={() => setFormData({...formData, scheduleType: 'schedule'})}
                        className="text-primary-main focus:ring-primary-main"
                      />
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-text-secondary" />
                        <DatePicker
                          selected={scheduleDate}
                          onChange={(date) => setScheduleDate(date)}
                          showTimeSelect
                          dateFormat="Pp"
                          className="p-2 border border-border rounded-lg text-text-primary"
                          popperPlacement="auto"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg text-text-primary hover:bg-background transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-primary-main text-surface rounded-lg hover:bg-primary-dark transition-colors"
                >
                  حفظ ونشر
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MetaLoginButton = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        userId: '123',
        name: 'حساب ميتا',
        accessToken: 'mock-token'
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogin}
      disabled={isLoading}
      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-social-facebook text-surface
        hover:bg-[#166FE5] transition-colors shadow-lg"
    >
      {isLoading ? (
        <ArrowPathIcon className="h-5 w-5 animate-spin" />
      ) : (
        <GlobeAltIcon className="h-5 w-5" />
      )}
      <span>{isLoading ? 'جاري الربط...' : 'ربط بحساب ميتا'}</span>
    </motion.button>
  );
};

export default AdvancedAdsManager;