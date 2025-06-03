'use client';
import { useEffect } from 'react';
import { useLicenseStore } from './LicenseContext';

export default function ActivityTracker() {
  const { updateClientActivity } = useLicenseStore();

  useEffect(() => {
    const interval = setInterval(() => {
      // تحديث النشاط كل دقيقة
      updateClientActivity();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return null;
}