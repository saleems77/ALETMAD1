// ProtectedRoute.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch ,useSelector } from 'react-redux';
import { setUser, checkAuth } from '@/store/slices/authSlice';

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const router = useRouter();
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          localStorage.removeItem("jwt");
          router.push('/login');
          return;
        }
        
        const user = await res.json();
        dispatch(setUser(user));
      } catch (error) {
        console.error("خطأ التحقق:", error);
        localStorage.removeItem("jwt");
        router.push('/login');
      }
    };

    verifyAuth();
  }, [dispatch, router]);

  if (isLoading) {
    return <div>جاري التحقق...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
}