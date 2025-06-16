"use client";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserData } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function UserDataLoader() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      dispatch(fetchUserData(jwt));
    } else {
      router.push('/login');
    }
  }, [dispatch, router]);

  return null;
}