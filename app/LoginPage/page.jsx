'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogIn, FiUser, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle, FiGithub, FiChevronDown } from 'react-icons/fi';
import Loader from './Loader';
import { FcGoogle } from "react-icons/fc";
const theme = {
  colors: {
    primary: '#008DCB',    // 10%
    secondary: '#F9D011',  // 8%
    dark: '#0D1012',       // 5%
    danger: '#E2101E',     // 7%
    light: '#FFFFFF',      // 50%
    neutral: '#999999'     // 20%
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  }
};

const roles = [
  { value: 'Student', label: 'طالب', icon: '🎓' },
  { value: 'Traier', label: 'مدرب', icon: '👨🏫' },
  { value: 'Admin', label: 'الإدارة', icon: '👔' },
  { value: 'Finicial', label: 'الماليّة', icon: '💼' },
  { value: 'Marketing', label: 'التسويق', icon: '🤝' },
  { value: 'HR', label: ' الموارد البشرية', icon: '👥' },
];

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    remember: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (formData.email && !validateEmail(formData.email)) {
      setErrors(prev => ({...prev, email: 'بريد إلكتروني غير صحيح'}));
    } else {
      setErrors(prev => ({...prev, email: null}));
    }
  }, [formData.email]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'مطلوب';
    if (!formData.password) newErrors.password = 'مطلوب';
    if (!formData.role) newErrors.role = 'الرجاء اختيار الصلاحية';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccessMessage('تم الدخول بنجاح!');
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/DashBoard${formData.role}`);
    } catch (error) {
      setErrors({ general: 'فشل في المصادقة. الرجاء التحقق من البيانات' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/3 to-light/5 p-4 relative overflow-hidden">
      {/* تأثيرات الخلفية */}
      <motion.div
        className="absolute inset-0 bg-noise opacity-5 pointer-events-none"
        style={{ backgroundImage: 'url(/noise.png)' }}
      />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror' }}
        className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 blur-3xl"
      />

      <motion.form
        onSubmit={handleLogin}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-light backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 relative z-10 border border-neutral/20"
        style={{ 
          backgroundColor: theme.colors.light,
          boxShadow: `0 8px 32px ${theme.colors.neutral}20`
        }}
      >
        {/* الرأس */}
        <div className="text-center space-y-4">
          <motion.div
            className="inline-block p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10"
            style={{ boxShadow: `inset 0 4px 12px ${theme.colors.primary}20` }}
          >
            <img 
              src="/الاعتماد العربي.png" 
              className="h-20 w-auto mx-auto"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
              alt="شعار المنصة"
            />
          </motion.div>
          <h1 
            className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ lineHeight: '1.3' }}
          >
            نظام الإعتماد العربي
          </h1>
        </div>

        {/* حقل البريد الإلكتروني */}
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: theme.colors.dark }}>
            البريد الإلكتروني
          </label>
          <motion.div whileHover={{ scale: 1.02 }} className="relative">
            <FiUser 
              className="absolute top-3 left-3" 
              style={{ color: theme.colors.primary }} 
            />
            <input
              type="email"
              placeholder="example@domain.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl transition-all"
              style={{
                border: `2px solid ${errors.email ? theme.colors.danger + '50' : theme.colors.neutral + '30'}`,
                color: theme.colors.dark,
                backgroundColor: theme.colors.light,
              }}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              onBlur={() => {
                if (!formData.email) return;
                setErrors(prev => ({...prev, email: !validateEmail(formData.email) ? 'بريد إلكتروني غير صحيح' : null}));
              }}
            />
            {errors.email && (
              <motion.span 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-5 left-0 text-xs flex items-center gap-1"
                style={{ color: theme.colors.danger }}
              >
                <FiAlertCircle /> {errors.email}
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* حقل كلمة المرور */}
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: theme.colors.dark }}>
            كلمة المرور
          </label>
          <motion.div whileHover={{ scale: 1.02 }} className="relative">
            <FiLock 
              className="absolute top-3 left-3" 
              style={{ color: theme.colors.primary }} 
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 rounded-xl transition-all"
              style={{
                border: `2px solid ${errors.password ? theme.colors.danger + '50' : theme.colors.neutral + '30'}`,
                color: theme.colors.dark,
                backgroundColor: theme.colors.light,
              }}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 transition-colors"
              style={{ color: theme.colors.neutral }}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.password && (
              <motion.span 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-5 left-0 text-xs flex items-center gap-1"
                style={{ color: theme.colors.danger }}
              >
                <FiAlertCircle /> {errors.password}
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* اختيار الصلاحية */}
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: theme.colors.dark }}>
            صلاحية الدخول
          </label>
          <motion.div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full pl-4 pr-10 py-3 text-left rounded-xl transition-all flex items-center gap-2 ${
                errors.role ? 'border-danger/50' : 'border-neutral/30 hover:border-primary/50'
              }`}
              style={{
                border: `2px solid ${errors.role ? theme.colors.danger + '50' : theme.colors.neutral + '30'}`,
                color: formData.role ? theme.colors.dark : theme.colors.neutral,
                backgroundColor: theme.colors.light,
              }}
            >
              {formData.role ? (
                <>
                  <span>{roles.find(r => r.value === formData.role)?.icon}</span>
                  {roles.find(r => r.value === formData.role)?.label}
                </>
              ) : 'اختر صلاحية الدخول'}
              <FiChevronDown 
                className={`absolute right-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                style={{ color: theme.colors.neutral }}
              />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute w-full mt-2 bg-light border border-neutral/20 rounded-xl shadow-lg z-20"
                  style={{ backgroundColor: theme.colors.light }}
                >
                  {roles.map((role) => (
                    <div
                      key={role.value}
                      onClick={() => {
                        setFormData({...formData, role: role.value});
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 p-3 hover:bg-primary/10 cursor-pointer transition-colors"
                      style={{ color: theme.colors.dark }}
                    >
                      <span>{role.icon}</span>
                      {role.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {errors.role && (
              <motion.span 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-5 left-0 text-xs flex items-center gap-1"
                style={{ color: theme.colors.danger }}
              >
                <FiAlertCircle /> {errors.role}
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* تذكرني */}
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={formData.remember}
            onChange={(e) => setFormData({...formData, remember: e.target.checked})}
            className="w-4 h-4 accent-primary"
            style={{ color: theme.colors.primary }}
          />
          <span style={{ color: theme.colors.neutral }}>تذكر بيانات الدخول</span>
        </label>

        {/* الرسائل */}
        <AnimatePresence>
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: theme.colors.danger + '10', color: theme.colors.danger }}
            >
              <FiAlertCircle /> {errors.general}
            </motion.div>
          )}
          
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: theme.colors.primary + '10', color: theme.colors.primary }}
            >
              <FiCheckCircle /> {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* زر الدخول */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-xl relative overflow-hidden group"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
            boxShadow: `0 4px 12px ${theme.colors.primary}30`
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2"
            style={{ color: theme.colors.light }}>
            {isLoading ? (
              <Loader size="24px" color={theme.colors.light} />
            ) : (
              <>
                <FiLogIn className="text-lg" />
                دخول إلى النظام
              </>
            )}
          </span>
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
            style={{ backgroundColor: theme.colors.light }}
          />
        </motion.button>

        {/* الدخول الاجتماعي */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: theme.colors.neutral + '20' }}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span 
                className="px-2 bg-light"
                style={{ color: theme.colors.neutral }}
              >
                أو الدخول باستخدام
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              onClick={() => handleSocialLogin('google')}
              whileHover={{ y: -2 }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl transition-colors"
              style={{
                border: `2px solid ${theme.colors.neutral}20`,
                color: theme.colors.dark
              }}
            >
              <FcGoogle style={{ color: theme.colors.danger }} />
              Google
            </motion.button>
            
            <motion.button
              type="button"
              onClick={() => handleSocialLogin('github')}
              whileHover={{ y: -2 }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl transition-colors"
              style={{
                border: `2px solid ${theme.colors.neutral}20`,
                color: theme.colors.dark
              }}
            >
              <FiGithub style={{ color: theme.colors.dark }} />
              GitHub
            </motion.button>
          </div>
        </div>

        {/* الروابط */}
        <div className="flex items-center justify-between text-sm">
          <a 
            href="/forgot-password"
            className="transition-colors hover:text-primary"
            style={{ color: theme.colors.neutral }}
          >
            نسيت كلمة المرور؟
          </a>
          <a 
            href="/signup"
            className="transition-colors hover:text-primary"
            style={{ color: theme.colors.neutral }}
          >
            إنشاء حساب جديد
          </a>
        </div>
      </motion.form>
    </div>
  );
}