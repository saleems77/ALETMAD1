"use client";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function GlobalErrorHandler() {
  const { error } = useSelector((state) => state.auth);
  const router = useRouter();
  
  useEffect(() => {
    if (error) {
      console.error('خطأ عام:', error);
      router.push('/login');
    }
  }, [error, router]);

  return null;
}