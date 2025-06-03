"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  useEffect(() => {
    if (!jwt) {
      router.push('/login');
    }
  }, [jwt, router]);

  return jwt ? children : null;
}