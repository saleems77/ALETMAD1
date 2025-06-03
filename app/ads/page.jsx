"use client"
import { useState, useEffect, useRef, forwardRef } from 'react';
import AdCampaignManager from './AdCampaignManager';
import PromotedCourseBanner from './PromotedCourseBanner';
import AdPerformanceChart from './AdPerformanceChart';
import { Toast } from '@/components/ui/Toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/Skeletonn';
import { Button } from '@/components/ui/Buttonn';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/use-toast';
import { BarChart4, Plus, Filter, Settings } from 'lucide-react';

const AdminAdsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedTab, setSelectedTab] = useState('active');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const campaignFormRef = useRef(null);

  const courses = [
    { id: 1, title: 'دورة تطوير الويب', category: 'تكنولوجيا' },
    { id: 2, title: 'دورة الذكاء الاصطناعي', category: 'ذكاء اصطناعي' },
    { id: 3, title: 'دورة التصميم الجرافيكي', category: 'تصميم' }
  ];

  const themeColors = {
    primary: '#008DCB',
    secondary: '#F9D011',
    background: '#FFFFFF',
    text: '#0D1012',
    accent: '#E2101E'
  };

  useEffect(() => {
    const loadCampaigns = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('campaigns') || '[]');
        setCampaigns(saved);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: 'خطأ في تحميل البيانات',
          description: 'حدث خطأ أثناء تحميل الحملات السابقة',
          variant: 'destructive'
        });
      }
    };

    setTimeout(loadCampaigns, 1500);
  }, [toast]);

  const handleCreateCampaign = (newCampaign) => {
    const updated = [...campaigns, { 
      ...newCampaign,
      id: Date.now(),
      status: 'active',
      stats: generateCampaignStats()
    }];
    
    setCampaigns(updated);
    localStorage.setItem('campaigns', JSON.stringify(updated));
    
    toast({
      title: '🎉 تم إنشاء الحملة!',
      description: 'تمت إضافة الحملة الجديدة بنجاح',
      style: { backgroundColor: themeColors.primary + '20' }
    });
  };

  const generateCampaignStats = () => ({
    views: Math.floor(Math.random() * 10000),
    conversions: Math.floor(Math.random() * 500),
    ctr: (Math.random() * 20).toFixed(1) + '%',
    cost: Math.floor(Math.random() * 5000)
  });

  const filteredCampaigns = campaigns.filter(c => {
    const now = new Date();
    return selectedTab === 'active' 
      ? new Date(c.endDate) > now 
      : new Date(c.endDate) <= now;
  });

  const handleScrollToForm = () => {
    if (campaignFormRef.current) {
      campaignFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="container mx-auto p-6 space-y-8"
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 
            className="text-3xl md:text-4xl font-bold"
            style={{ color: themeColors.text }}
          >
            الإعلانات المدفوعة
          </h1>
          <p className="text-gray-500 mt-2">
            إدارة الحملات الإعلانية وعرض التحليلات
          </p>
        </div>

        <div className="flex gap-3 items-start">
          <Button
            onClick={handleScrollToForm}
            variant="primary"
            style={{ backgroundColor: themeColors.primary }}
          >
            <Plus className="mr-2" />
            حملة جديدة
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="mr-2" />
            الفلاتر
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="الحملات النشطة"
          value={campaigns.filter(c => c.status === 'active').length}
          icon={<BarChart4 color={themeColors.primary} />}
          color={themeColors.primary}
        />
        <StatCard
          title="معدل التحويل"
          value="8.4%"
          trend="+2.1%"
          icon={<BarChart4 color={themeColors.secondary} />}
          color={themeColors.secondary}
        />
        <StatCard
          title="إجمالي الإنفاق"
          value={`${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()} ر.س`}
          icon={<BarChart4 color={themeColors.accent} />}
          color={themeColors.accent}
        />
        <StatCard
          title="الزيارات اليوم"
          value={campaigns.reduce((sum, c) => sum + (c.stats?.views || 0), 0).toLocaleString()}
          icon={<BarChart4 color={themeColors.text} />}
          color={themeColors.text}
        />
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-2 w-full md:w-64">
          <TabsTrigger value="active" style={{ color: themeColors.primary }}>
            النشطة ({campaigns.filter(c => c.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="ended" style={{ color: themeColors.accent }}>
            المنتهية ({campaigns.filter(c => c.status === 'ended').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <AdCampaignManager 
        ref={campaignFormRef}
        id="campaign-form"
        courses={courses} 
        onCreateCampaign={handleCreateCampaign} 
        themeColors={themeColors}
      />

      {filteredCampaigns.length > 0 ? (
        <>
          <PromotedCourseBanner 
            campaigns={filteredCampaigns} 
            themeColors={themeColors}
          />
          
          <AdPerformanceChart 
            data={filteredCampaigns.map(c => ({
              date: c.startDate,
              views: c.stats.views,
              conversions: c.stats.conversions
            }))}
            themeColors={themeColors}
          />
        </>
      ) : (
        <div className="text-center py-12 space-y-4">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <p className="text-gray-500">لا توجد حملات لعرضها</p>
        </div>
      )}

      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent style={{ backgroundColor: themeColors.background }}>
          <DialogHeader>
            <h2 className="text-xl font-bold" style={{ color: themeColors.text }}>
              فلاتر البحث
            </h2>
          </DialogHeader>
          <div className="space-y-4">
            {/* محتوى الفلاتر */}
          </div>
        </DialogContent>
      </Dialog>

      <Toast />
    </div>
  );
};

const StatCard = ({ title, value, trend, icon, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold" style={{ color }}>
            {value}
          </span>
          {trend && (
            <span 
              className="text-sm"
              style={{ color: trend.startsWith('+') ? '#008DCB' : '#E2101E' }}
            >
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className="p-2 rounded-lg" style={{ backgroundColor: color + '10' }}>
        {icon}
      </div>
    </div>
  </div>
);

export default AdminAdsPage;