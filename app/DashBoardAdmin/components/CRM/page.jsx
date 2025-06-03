// app/dashboard/analytics/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { ToastContainer, toast } from 'react-toastify';
import RealTimeStats from './RealTimeStats';
import AudienceReport from './AudienceReport';
import PageViewsChart from './PageViewsChart';
import CookieBanner from './CookieBanner';
import ConsentSettings from './ConsentSettings';
import { initializeAnalytics } from './analytics';
import 'react-toastify/dist/ReactToastify.css';

const AnalyticsDashboard = () => {
  // ============= STATE MANAGEMENT =============
  const [consentGiven, setConsentGiven] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    realTime: { // <-- أضف قيمًا افتراضية
      activeUsers: 0,
      sessions: 0,
      bounceRate: 0
    },
    audience: { // أضف هيكلًا افتراضيًا
        countries: [],
        devices: {
          desktop: 0,
          mobile: 0,
          tablet: 0
        }
      },
      pageViews: []
  });

  // ============= CORE FUNCTIONS =============
  useEffect(() => {
    if (consentGiven) {
      initializeFakeAnalytics();
      initializeAnalytics(); // تكامل مع مكتبة التحليلات
    }
  }, [consentGiven]);

  const initializeFakeAnalytics = () => {
    // توليد بيانات وهمية أولية
    const mockData = {
      realTime: {
        activeUsers: faker.number.int({ min: 50, max: 500 }),
        sessions: faker.number.int({ min: 100, max: 1000 }),
        bounceRate: faker.number.float({ min: 0.1, max: 0.7 })
      },
      audience: {
        countries: generateCountriesData(),
        devices: generateDevicesData()
      },
      pageViews: generatePageViews()
    };

    setAnalyticsData(mockData);
    startDataStreaming();
  };

  const generateCountriesData = () => {
    return Array.from({ length: 5 }, () => ({
      country: faker.location.country(),
      visits: faker.number.int({ min: 100, max: 5000 })
    }));
  };

  const generateDevicesData = () => ({
    desktop: faker.number.int({ min: 40, max: 70 }),
    mobile: faker.number.int({ min: 20, max: 50 }),
    tablet: faker.number.int({ min: 5, max: 15 })
  });

  const generatePageViews = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      date: faker.date.recent({ days: 30 }),
      views: faker.number.int({ min: 100, max: 5000 })
    })).sort((a, b) => a.date - b.date);
  };

  const startDataStreaming = () => {
    // محاكاة تحديث البيانات في الوقت الحقيقي
    setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        realTime: {
          activeUsers: prev.realTime.activeUsers + faker.number.int({ min: -10, max: 20 }),
          sessions: prev.realTime.sessions + faker.number.int({ min: 0, max: 50 }),
          bounceRate: Math.min(Math.max(prev.realTime.bounceRate + faker.number.float({ min: -0.1, max: 0.1 }), 0.1), 0.9)
        }
      }));
    }, 5000);
  };

  // ============= EVENT HANDLERS =============
  const handleConsentUpdate = (newConsent) => {
    setConsentGiven(newConsent);
    toast.info(newConsent ? 'تم تفعيل التتبع' : 'تم إيقاف التتبع');
  };

  // ============= MAIN RENDER =============
  if (!consentGiven) {
    return <CookieBanner onAccept={() => handleConsentUpdate(true)} />;
  }

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h1>لوحة تحليلات CRM</h1>
        <ConsentSettings onSettingsChange={handleConsentUpdate} />
      </div>

      <div className="grid-layout">
        <div className="main-metrics">
          <RealTimeStats 
            activeUsers={analyticsData.realTime.activeUsers}
            sessions={analyticsData.realTime.sessions}
            bounceRate={analyticsData.realTime.bounceRate}
          />
        </div>

        <div className="audience-section">
          <AudienceReport 
            countries={analyticsData.audience.countries}
            devices={analyticsData.audience.devices}
          />
        </div>

        <div className="chart-section">
          <PageViewsChart data={analyticsData.pageViews} />
        </div>
      </div>

      <ToastContainer position="bottom-left" theme="colored" />
    </div>
  );
};

export default AnalyticsDashboard;