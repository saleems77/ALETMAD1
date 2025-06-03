'use client';
import { useEffect } from 'react';
import { notification } from 'antd';
import socket from '@/lib/socket';

const NotificationSystem = () => {
  useEffect(() => {
    socket.on('new-certificate-request', (data) => {
      notification.info({
        message: 'طلب شهادة جديد',
        description: `طلب ${data.studentName} إصدار شهادة ل${data.courseName}`,
      });
    });

    return () => socket.off('new-certificate-request');
  }, []);

  return null;
};