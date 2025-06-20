"use client"
import { useState, useEffect } from 'react';
import { AuthLayout } from './AuthLayout';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation'; 
import toast, { Toaster } from 'react-hot-toast';
import { 
  LockClosedIcon, 
  EnvelopeIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  PhoneIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// لوحة تسجيل الدخول
const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, user, error: authError } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (user?.jwt) {
      handleRedirectBasedOnRole(user.role.name);
    }
    
    // معالجة أخطاء المصادقة من Redux
    if (authError) {
      handleLoginError(authError);
    }
  }, [user, authError]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'بريد إلكتروني غير صالح';
    
    if (!formData.password.trim()) newErrors.password = 'كلمة المرور مطلوبة';
    else if (formData.password.length < 6) newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await dispatch(loginUser({
        email: formData.email,
        password: formData.password
      }));

      if (result.payload?.jwt) {
        handleLoginSuccess(result.payload);
      } else if (result.error) {
        handleLoginError(result.error);
      }
    } catch (error) {
      handleLoginError(error);
    }
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('jwt', userData.jwt);
    localStorage.setItem('userRole', userData.user.role.name);
 
    toast.success('مرحباً بك! جاري تحميل لوحة التحكم...', {
      duration: 2000,
      style: { 
        background: '#38a169', 
        color: '#fff', 
        direction: 'rtl',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#38a169',
      }
    });

    // تأخير التوجيه لإظهار الرسالة
    setTimeout(() => {
      handleRedirectBasedOnRole(userData.user.role.name);
    }, 2000);
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
    let errorMessage = 'فشل تسجيل الدخول';
    
    // معالجة أخطاء مختلفة
    if (error?.message) {
      switch (error.message) {
        case 'Invalid identifier or password':
          errorMessage = 'بيانات الدخول غير صحيحة';
          break;
        case 'Too many requests':
          errorMessage = 'محاولات كثيرة، حاول لاحقاً';
          break;
        case 'User not found':
          errorMessage = 'الحساب غير موجود';
          break;
        case 'ERR_NETWORK':
          errorMessage = 'تعذر الاتصال بالخادم';
          break;
        default:
          errorMessage = error.message;
      }
    }
    
    // معالجة أخطاء حالة HTTP
    if (error?.payload?.status) {
      switch (error.payload.status) {
        case 400:
          errorMessage = 'بيانات الدخول غير مكتملة';
          break;
        case 401:
          errorMessage = 'غير مصرح بالدخول';
          break;
        case 403:
          errorMessage = 'تم حظر الحساب';
          break;
        case 404:
          errorMessage = 'المستخدم غير موجود';
          break;
        case 500:
          errorMessage = 'خطأ في الخادم الداخلي';
          break;
        case 503:
          errorMessage = 'الخدمة غير متوفرة حالياً';
          break;
      }
    }
    
    // معالجة أخطاء من رد الخادم
    if (error?.payload?.data?.error?.message) {
      errorMessage = error.payload.data.error.message;
    }

    toast.error(errorMessage, {
      duration: 5000,
      style: {
        background: '#E2101E',
        color: '#fff',
        direction: 'rtl',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(226, 16, 30, 0.2)'
      },
      icon: <ExclamationCircleIcon className="h-5 w-5 text-white" />,
      iconTheme: {
        primary: '#fff',
        secondary: '#E2101E',
      }
    });
  };

  return (
    <AuthLayout title="تسجيل الدخول">
      <Toaster position="top-center" reverseOrder={false} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* حقل البريد الإلكتروني */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              className={`form-input ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500 block w-full pr-10 sm:text-sm rounded-md transition duration-300`}
              placeholder="example@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && 
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                {errors.email}
              </p>
            }
          </div>
        </div>

        {/* حقل كلمة المرور */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`form-input ${errors.password ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500 block w-full pr-10 sm:text-sm rounded-md transition duration-300`}
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
                <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-blue-600 transition-colors" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500 hover:text-blue-600 transition-colors" />
              )}
            </button>
            {errors.password && 
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                {errors.password}
              </p>
            }
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
            <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-700">
              تذكرني
            </label>
          </div>

          <div className="text-sm">
            <Link 
              href="/forgot-password" 
              className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          } ${isHovered ? 'ring-2 ring-blue-300' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري التسجيل...
            </div>
          ) : (
            'تسجيل دخول'
          )}
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

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button 
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
              </svg>
              <span className="mr-2">فيسبوك</span>
            </div>
          </button>

          <button 
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307c-1.467-1.547-3.563-2.667-6.213-2.667-5.307 0-9.64 4.373-9.64 9.72s4.333 9.72 9.64 9.72c4.267 0 8.12-2.88 8.12-8.267 0-.52-.053-.92-.173-1.32h-7.95z"/>
              </svg>
              <span className="mr-2">جوجل</span>
            </div>
          </button>
        </div>
      </div>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        ليس لديك حساب؟{' '}
        <Link 
          href="/register" 
          className="font-medium text-yellow-600 hover:text-yellow-700 transition-colors duration-300 underline"
        >
          إنشاء حساب
        </Link>
      </p>
    </AuthLayout>
  );
};
export default Login;