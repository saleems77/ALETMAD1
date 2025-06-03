//app/Social/SocialScheduler.jsx
"use client";
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Link2, 
  Calendar, 
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
  Share2
} from 'lucide-react';
import Notification from '@/components/ui/Notification';

// نظام الألوان المحدد مع النسب
const COLORS = {
  blue: '#008DCB',    // 10%
  black: '#0D1012',   // 5%
  gray: '#999999',    // 20%
  red: '#E2101E',     // 7%
  white: '#FFFFFF',   // 50%
  yellow: '#F9D011'   // 8%
};

const PlatformCard = ({ platform, selected, onClick, connectedAccounts }) => {
  const platformStyles = {
    facebook: { icon: <Facebook className="w-5 h-5" />, color: COLORS.blue },
    instagram: { icon: <Instagram className="w-5 h-5" />, color: COLORS.red }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
        selected ? 'border-blue-500' : 'border-gray-200 hover:border-blue-200'
      }`}
      style={{
        backgroundColor: selected ? `${COLORS.blue}10` : COLORS.white,
        borderColor: selected ? COLORS.blue : COLORS.gray
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div style={{ color: platformStyles[platform].color }}>
          {platformStyles[platform].icon}
        </div>
        <div>
          <h3 className="font-medium" style={{ color: COLORS.black }}>
            {platform === 'facebook' ? 'فيسبوك' : 'إنستغرام'}
          </h3>
          <p className="text-sm" style={{ color: COLORS.gray }}>
            {connectedAccounts.length} حساب متصل
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function SocialScheduler() {
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [publishDate, setPublishDate] = useState(new Date());
  const [notification, setNotification] = useState(null);
  const [connectedAccounts, setConnectedAccounts] = useState({
    facebook: [{ id: '789', name: 'الصفحة الرسمية' }],
    instagram: [{ id: '101', username: 'الحساب_الرسمي' }]
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // محاكاة اتصال حساب جديد
  const connectAccount = async (platform) => {
    setIsConnecting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newAccount = {
        id: Date.now(),
        name: `حساب جديد ${platform === 'facebook' ? '📘' : '📸'}`
      };
      
      setConnectedAccounts(prev => ({
        ...prev,
        [platform]: [...prev[platform], newAccount]
      }));
      
      setNotification({
        message: `تم ربط حساب ${platform === 'facebook' ? 'فيسبوك' : 'إنستغرام'} بنجاح`,
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: `فشل في ربط الحساب`,
        type: 'error'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!postContent.trim()) {
      setNotification({ message: 'يرجى إدخال محتوى المنشور', type: 'error' });
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      setNotification({ message: 'يرجى اختيار منصة واحدة على الأقل', type: 'error' });
      return;
    }

    try {
      setNotification({ message: 'جاري جدولة المنشور...', type: 'loading' });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setNotification({
        message: 'تم جدولة المنشور بنجاح 🎉',
        type: 'success'
      });
      
      setPostContent('');
      setSelectedPlatforms([]);
      setPublishDate(new Date());
    } catch (error) {
      setNotification({
        message: 'حدث خطأ أثناء الجدولة',
        type: 'error'
      });
    }
  };

  return (
    <div className="p-6 rounded-2xl shadow-xl" style={{ 
      backgroundColor: COLORS.white,
      border: `1px solid ${COLORS.gray}`
    }}>
      <AnimatePresence>
        {notification && (
          <Notification 
            {...notification} 
            colors={COLORS}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* محتوى المنشور */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: COLORS.black }}>
            محتوى المنشور
          </label>
          <motion.div
            whileFocus={{ boxShadow: `0 0 0 3px ${COLORS.blue}20` }}
            className="border rounded-xl overflow-hidden"
            style={{ borderColor: COLORS.gray }}
          >
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="✍️ اكتب منشورك هنا..."
              className="w-full p-4 focus:outline-none min-h-[200px] resize-none"
              style={{ backgroundColor: COLORS.white }}
              maxLength={500}
            />
            <div className="border-t p-3 flex items-center justify-between" style={{ borderColor: COLORS.gray }}>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                  style={{ color: COLORS.blue }}
                >
                  📷
                </button>
                <button 
                  type="button" 
                  className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                  style={{ color: COLORS.blue }}
                >
                  🔗
                </button>
              </div>
              <span className="text-sm" style={{ color: COLORS.gray }}>
                {postContent.length}/500
              </span>
            </div>
          </motion.div>
        </div>

        {/* اختيار المنصات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-4" style={{ color: COLORS.black }}>
              اختر المنصات
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {['facebook', 'instagram'].map((platform) => (
                <PlatformCard
                  key={platform}
                  platform={platform}
                  selected={selectedPlatforms.includes(platform)}
                  onClick={() => {
                    setSelectedPlatforms(prev =>
                      prev.includes(platform)
                        ? prev.filter(p => p !== platform)
                        : [...prev, platform]
                    )
                  }}
                  connectedAccounts={connectedAccounts[platform]}
                />
              ))}
            </div>
          </div>

          {/* إعدادات النشر */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-4" style={{ color: COLORS.black }}>
                إعدادات النشر
              </h3>
              
              {/* وقت النشر */}
              <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.white }}>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.black }}>
                  وقت النشر
                </label>
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-500" style={{ color: COLORS.gray }} />
                  <DatePicker
                    selected={publishDate}
                    onChange={setPublishDate}
                    showTimeSelect
                    dateFormat="yyyy/MM/dd HH:mm"
                    className="w-full p-2 rounded-lg border focus:ring-2 transition-all"
                    style={{ 
                      borderColor: COLORS.gray,
                      backgroundColor: COLORS.white,
                      color: COLORS.black,
                      focus: { borderColor: COLORS.blue }
                    }}
                  />
                </div>
              </div>

              {/* الحسابات المتصلة */}
              <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: COLORS.white }}>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.black }}>
                  الحسابات المحددة
                </label>
                <div className="space-y-3">
                  {selectedPlatforms.map((platform) => (
                    <div key={platform} className="flex items-center gap-2">
                      {platform === 'facebook' ? (
                        <Facebook className="w-5 h-5" style={{ color: COLORS.blue }} />
                      ) : (
                        <Instagram className="w-5 h-5" style={{ color: COLORS.red }} />
                      )}
                      <select 
                        className="w-full p-2 rounded-lg border transition-all"
                        style={{ 
                          borderColor: COLORS.gray,
                          backgroundColor: COLORS.white,
                          color: COLORS.black
                        }}
                      >
                        {connectedAccounts[platform].map(acc => (
                          <option key={acc.id}>
                            {acc.name || acc.username}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
            style={{ 
              backgroundColor: COLORS.blue,
              color: COLORS.white
            }}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Calendar className="w-5 h-5" />
                جدولة المنشور
              </>
            )}
          </motion.button>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => connectAccount('facebook')}
              className="flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all"
              style={{ 
                borderColor: COLORS.gray,
                backgroundColor: COLORS.white,
                opacity: isConnecting ? 0.7 : 1
              }}
              disabled={isConnecting}
            >
              <Share2 className="w-5 h-5" style={{ color: COLORS.blue }} />
              <span style={{ color: COLORS.black }}>ربط حساب فيسبوك</span>
            </button>
            
            <button
              type="button"
              onClick={() => connectAccount('instagram')}
              className="flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all"
              style={{ 
                borderColor: COLORS.gray,
                backgroundColor: COLORS.white,
                opacity: isConnecting ? 0.7 : 1
              }}
              disabled={isConnecting}
            >
              <Share2 className="w-5 h-5" style={{ color: COLORS.red }} />
              <span style={{ color: COLORS.black }}>ربط حساب إنستغرام</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}