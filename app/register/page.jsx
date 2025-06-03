"use client";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { LockClosedIcon, EnvelopeIcon, UserIcon, EyeIcon, EyeSlashIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { AuthLayout } from '../login/AuthLayout';
import { registerUser } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import Link from 'next/link';

const Register = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading } = useSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState({});

  // التحقق من صحة النموذج
  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^05\d{8}$/;

    if (!formData.name.trim()) newErrors.name = 'الاسم الكامل مطلوب';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'بريد إلكتروني غير صالح';
    if (formData.password.length < 6) newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'رقم الهاتف يجب أن يبدأ بـ 05 ويحتوي على 10 أرقام';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const result = await dispatch(registerUser(formData));

    if (result.payload?.jwt) {
      toast.success('تم إنشاء الحساب بنجاح!', {
        style: { background: '#38a169', color: '#fff', direction: 'rtl' }
      });
      router.push('/login');
    } else if (result.error) {
      handleRegistrationError(result.error);
    }
  } catch (error) {
    handleRegistrationError(error);
  }
};


const handleRegistrationError = (error) => {
  const errorMessages = {
    'Email already taken': 'البريد الإلكتروني مسجل مسبقًا',
    'Username already taken': 'اسم المستخدم موجود مسبقًا',
    'ValidationError': 'بيانات غير صالحة'
  };

  const message = errorMessages[error?.message] || 'حدث خطأ أثناء التسجيل';
  toast.error(message, {
    style: { background: '#e53e3e', color: '#fff', direction: 'rtl' }
  });
};

  return (
    <AuthLayout title="إنشاء حساب جديد">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* حقل الاسم */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            الاسم الكامل
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className={`form-input ${errors.name ? 'border-red-300' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm rounded-md`}
              placeholder="أحمد محمد"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
          </div>
        </div>

        {/* حقل البريد الإلكتروني */}
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

        {/* حقل كلمة المرور */}
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

        {/* حقل رقم الهاتف */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            رقم الهاتف
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
           <input
  type="tel"
  className={`form-input ${errors.phone ? 'border-red-300' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm rounded-md`}
  placeholder="0512345678"
  value={formData.phone}
  onChange={(e) => setFormData({...formData, phone: e.target.value})}
  // إزالة خاصية pattern هنا
/>
            {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
          </div>
        </div>

        {/* زر التسجيل */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -mr-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري الإنشاء...
            </div>
          ) : (
            'إنشاء حساب'
          )}
        </button>
      </form>

      {/* رابط تسجيل الدخول */}
      <p className="mt-6 text-center text-sm text-gray-600">
        لديك حساب بالفعل؟{' '}
        <Link 
          href="/login" 
          className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors duration-200"
        >
          سجل الدخول
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;