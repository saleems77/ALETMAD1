// src/components/SocialDashboard.jsx - النسخة النهائية
"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Box, 
  Grid, 
  Typography, 
  CircularProgress,
  useTheme,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import {
  DashboardCustomize,
  Analytics,
  Schedule,
  Group,
  Settings
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import SocialIntegration from './SocialIntegration';
import ClientManagement from './ClientManagement';
import TeamCollaboration from './TeamCollaboration';
import EnhancedPostScheduler from './EnhancedPostScheduler';
import PlatformSelector from './PlatformSelector';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Dynamic imports للأداء الأمثل
const DynamicCalendar = dynamic(() => import('./CalendarView'), { 
  ssr: false,
  loading: () => <CircularProgress />
});

const AdvancedAnalytics = dynamic(() => import('./AdvancedAnalytics'), {
  loading: () => <CircularProgress />
});

const SocialDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    socialAccounts: [],
    scheduledPosts: [],
    clients: [],
    analytics: {},
    teamMembers: [],
    platforms: [
      {
        id: 1,
        name: 'فيسبوك',
        icon: '/icons/facebook.svg',
        connected: true,
        stats: { followers: 15000, engagement: 8.2 }
      },
      {
        id: 2,
        name: 'إنستجرام',
        icon: '/icons/instagram.svg',
        connected: true,
        stats: { followers: 23000, engagement: 12.5 }
      },
      {
        id: 3,
        name: 'تيك توك',
        icon: '/icons/tiktok.svg',
        connected: false,
        stats: { followers: 0, engagement: 0 }
      }
    ]
  });
  
  const theme = useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [socialRes, analyticsRes] = await Promise.all([
          fetch('/data.json'),
          fetch('/analytics.json')
        ]);
        
        const combinedData = {
          ...await socialRes.json(),
          analytics: await analyticsRes.json()
        };
        
        setDashboardData(prev => ({
          ...prev,
          ...combinedData,
          platforms: prev.platforms.map(p => ({
            ...p,
            ...combinedData.socialAccounts.find(a => a.platform === p.name)
          }))
        }));
        toast.success('تم تحديث البيانات بنجاح!');
      } catch (error) {
        toast.error('حدث خطأ في تحميل البيانات!');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNewPost = (newPost) => {
    setDashboardData(prev => ({
      ...prev,
      scheduledPosts: [...prev.scheduledPosts, newPost]
    }));
    toast.success('تم جدولة المنشور بنجاح!');
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: theme.palette.background.default
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CircularProgress size={80} thickness={2.5} />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 4, 
      background: theme.palette.background.default,
      minHeight: '100vh'
    }}>
      {/* شريط التنقل العلوي */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        background: theme.palette.background.paper,
        p: 3,
        borderRadius: 4,
        boxShadow: theme.shadows[3]
      }}>
        <Typography variant="h3" sx={{ 
          fontWeight: 700,
          background: theme.palette.primary.main,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'Tajawal, Arial, sans-serif'
        }}>
          🚀 لوحة التحكم الذكية
        </Typography>
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: 2
            }
          }}
        >
          <Tab icon={<DashboardCustomize />} label="الرئيسية" />
          <Tab icon={<Analytics />} label="التحليلات" />
          <Tab icon={<Schedule />} label="الجدولة" />
          <Tab icon={<Group />} label="الفريق" />
          <Tab icon={<Settings />} label="الإعدادات" />
        </Tabs>
      </Box>

      {/* محتوى الأقسام */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <AdvancedAnalytics 
                posts={dashboardData.scheduledPosts}
                clients={dashboardData.clients}
                engagementData={dashboardData.analytics}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <SocialIntegration 
                accounts={dashboardData.socialAccounts} 
                onUpdate={setDashboardData}
              />
              <PlatformSelector 
                platforms={dashboardData.platforms}
                sx={{ mt: 3 }}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Box sx={{ height: '75vh' }}>
            <DynamicCalendar posts={dashboardData.scheduledPosts} />
          </Box>
        )}

        {activeTab === 2 && (
          <EnhancedPostScheduler 
            posts={dashboardData.scheduledPosts}
            platforms={dashboardData.platforms}
            onNewPost={handleNewPost}
          />
        )}

        {activeTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ClientManagement 
                clients={dashboardData.clients} 
                teamMembers={dashboardData.teamMembers}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TeamCollaboration 
                team={dashboardData.teamMembers}
                onUpdate={setDashboardData}
              />
            </Grid>
          </Grid>
        )}
      </motion.div>

      {/* إشعارات النظام */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ direction: 'rtl' }}
      />
    </Box>
  );
};

export default SocialDashboard;