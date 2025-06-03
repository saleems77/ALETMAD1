// components/AdminRoute.jsx
"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || user?.role?.name !== 'PlatformAdmin') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  return isAuthenticated && user?.role?.name === 'PlatformAdmin' ? children : null;
};

export default AdminRoute;