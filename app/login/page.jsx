// components/Auth/Login.jsx
"use client"
import { useState ,useEffect } from 'react';
import { AuthLayout } from './AuthLayout';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation'; 
import toast from 'react-hot-toast';
import { LockClosedIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
    const { isLoading, user } = useSelector((state) => state.auth); // أضف user من الحالة
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
 useEffect(() => {
  if (user?.jwt) {
    handleRedirectBasedOnRole(user.role.name);
  }
}, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.password.trim()) newErrors.password = 'كلمة المرور مطلوبة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      console.log('بدء عملية التسجيل'); // <-- إضافة

    if (!validateForm()) return;

    try {
      const result = await dispatch(loginUser({
        email: formData.email,
        password: formData.password
      })); console.log('نتيجة التسجيل:', result);

      if (result.payload?.jwt) {      console.log('JWT المستلم:', result.payload.jwt); // <-- إضافة

        handleLoginSuccess(result.payload);
      } else if (result.error) {
        handleLoginError(result.error);
      }
    } catch (error) {
          console.error('خطأ في التسجيل:', error); // <-- إضافة

      handleLoginError(error);
    }
    
  };

const handleLoginSuccess = (userData) => {
    // تخزين البيانات في localStorage
    localStorage.setItem('jwt', userData.jwt);
    localStorage.setItem('userRole', userData.user.role.name);
 
    toast.success('مرحباً! جاري تحميل لوحة التحكم...', {
      style: { background: '#38a169', color: '#fff', direction: 'rtl' }
    });

    handleRedirectBasedOnRole(userData.user.role.name);
  };

  const handleRedirectBasedOnRole = (role) => {
    const dashboardPaths = {
      'PlattFormAdmin': '/DashBoardAdmin',
      'Employee': '/DashBoardTraier',
      'default': '/DashBoardTraier'
    };

    const path = dashboardPaths[role] || dashboardPaths.default;
    router.push(path);
  };
const handleLoginError = (error) => {
  const errorMapping = {
    'Invalid identifier or password': 'بيانات الدخول غير صحيحة',
    'Too many requests': 'محاولات كثيرة، حاول لاحقاً',
    'User not found': 'الحساب غير موجود',
    'ERR_NETWORK': 'تعذر الاتصال بالخادم'
  };

  const serverMessage = error.payload?.message || error.message;
  const statusCode = error.payload?.status;

  let finalMessage = errorMapping[serverMessage] || 'فشل تسجيل الدخول';

  // معالجة الأخطاء العامة
  if (statusCode === 400) finalMessage = 'بيانات الدخول غير مكتملة';
  if (statusCode === 401) finalMessage = 'غير مصرح بالدخول';
  if (statusCode === 500) finalMessage = 'خطأ في الخادم الداخلي';

  toast.error(finalMessage, {
    style: {
      background: '#e53e3e',
      color: '#fff',
      direction: 'rtl',
      borderRadius: '8px',
      padding: '16px'
    },
    duration: 4000
  });
};


  return (
    <AuthLayout title="تسجيل الدخول">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            البريد الإلكتروني
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              className={`form-input ${errors.email ? 'border-red-300' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm rounded-md`}
              placeholder="example@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            كلمة المرور
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`form-input ${errors.password ? 'border-red-300' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm rounded-md`}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button
              type="button"
              className="absolute left-3 inset-y-0 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              )}
            </button>
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-900">
              تذكرني
            </label>
          </div>

          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
              نسيت كلمة المرور؟
            </Link>
          </div>
        </div>

        <button
    type="submit"
    disabled={isLoading}
    className={`... ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {isLoading ? 'جاري التسجيل...' : 'تسجيل دخول '}
  </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">أو سجل باستخدام</span>
          </div>
        </div>

       
      </div>
      <p className="mt-6 text-center text-sm text-gray-600">
        ليس لديك حساب؟{' '}
        <Link href="/register" className="font-medium text-yellow-600 hover:text-yellow-500">
          إنشاء حساب
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;