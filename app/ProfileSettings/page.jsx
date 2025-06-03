"use client"
import React, { useState, useRef } from 'react';

const page = () => {
  // حالة التطبيق الرئيسية
  const [activeTab, setActiveTab] = useState('privacy');
  const [profileData, setProfileData] = useState({
    name: 'محمد علي',
    email: 'mohamed@example.com',
    bio: 'مطور واجهات أمامية',
    social: {
      facebook: 'facebook.com/user',
      twitter: 'twitter.com/user',
      linkedin: 'linkedin.com/in/user'
    }
  });
  const [settings, setSettings] = useState({
    showProfile: true,
    showTools: true,
    twoFactorAuth: false
  });
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  // معالجة تغيير البيانات
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  // معالجة تحميل الصورة
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // معالجة تغيير الإعدادات
  const toggleSetting = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 font-sans" dir="rtl">
      {/* العنوان الرئيسي */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">الملف الشخصي والإعدادات</h1>
        <p className="text-gray-500 mt-2">إدارة معلومات حسابك وإعدادات الخصوصية</p>
      </header>

      {/* شريط التنقل الرئيسي */}
      <nav className="flex overflow-x-auto pb-2 mb-6 hide-scrollbar">
        <div className="flex space-x-1">
          {[
            { id: 'privacy', label: 'الخصوصية', icon: '🔒' },
            { id: 'profile', label: 'الملف الشخصي', icon: '👤' },
            { id: 'security', label: 'الأمان', icon: '🛡️' },
            { id: 'social', label: 'التواصل', icon: '📱' },
            { id: 'preferences', label: 'التفضيلات', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-600 shadow-inner'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="ml-2">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* محتوى الأقسام */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* قسم الخصوصية */}
        {activeTab === 'privacy' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">إعدادات الخصوصية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">إظهار الملف الشخصي</h3>
                    <p className="text-sm text-gray-500 mt-1">السماح للآخرين برؤية ملفك</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.showProfile}
                    onChange={() => toggleSetting('showProfile')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">إظهار الأدوات</h3>
                    <p className="text-sm text-gray-500 mt-1">عرض أدوات التواصل</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.showTools}
                    onChange={() => toggleSetting('showTools')}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">نصائح الخصوصية</h3>
                <ul className="list-disc pr-5 space-y-2 text-sm text-blue-700">
                  <li>تحديث كلمة المرور بانتظام</li>
                  <li>مراجعة أذونات التطبيقات</li>
                  <li>ضبط إعدادات المشاركة</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* قسم الملف الشخصي */}
        {activeTab === 'profile' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">الملف الشخصي</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* تحميل الصورة */}
              <div className="w-full md:w-1/3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <div 
                    className="relative w-40 h-40 mx-auto rounded-full overflow-hidden bg-gray-100 mb-4 cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover"/>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <p className="text-sm text-gray-500 mt-2">الأبعاد الموصى بها: 600×600 بكسل</p>
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    تغيير الصورة
                  </button>
                </div>
              </div>

              {/* معلومات المستخدم */}
              <div className="w-full md:w-2/3 space-y-4">
                <EditableField
                  label="الاسم الكامل"
                  value={profileData.name}
                  onChange={(val) => handleInputChange('name', val)}
                />
                <EditableField
                  label="البريد الإلكتروني"
                  value={profileData.email}
                  onChange={(val) => handleInputChange('email', val)}
                  type="email"
                />
                <EditableField
                  label="نبذة عنك"
                  value={profileData.bio}
                  onChange={(val) => handleInputChange('bio', val)}
                  isTextarea={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* قسم الأمان */}
        {activeTab === 'security' && (
          <SecuritySection 
            twoFactorEnabled={settings.twoFactorAuth}
            onToggleTwoFactor={() => toggleSetting('twoFactorAuth')}
          />
        )}

        {/* قسم التواصل الاجتماعي */}
        {activeTab === 'social' && (
          <SocialLinksSection 
            socialLinks={profileData.social}
            onUpdateLinks={(updated) => handleInputChange('social', updated)}
          />
        )}

        {/* قسم التفضيلات */}
        {activeTab === 'preferences' && (
          <PreferencesSection />
        )}
      </div>
    </div>
  );
};

// مكونات مساعدة
const ToggleSwitch = ({ checked, onChange }) => (
  <label className="switch">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="slider round"></span>
  </label>
);

const EditableField = ({ label, value, onChange, type = 'text', isTextarea = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSave = () => {
    onChange(inputValue);
    setIsEditing(false);
  };

  return (
    <div className="border-b pb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing ? (
        <div className="space-y-2">
          {isTextarea ? (
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows={3}
            />
          ) : (
            <input
              type={type}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          )}
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              إلغاء
            </button>
            <button 
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              حفظ
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <p className="text-gray-800">{value || 'غير محدد'}</p>
          <button 
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            تعديل
          </button>
        </div>
      )}
    </div>
  );
};

const SecuritySection = ({ twoFactorEnabled, onToggleTwoFactor }) => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">إعدادات الأمان</h2>
    
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">المصادقة الثنائية</h3>
            <p className="text-sm text-gray-500 mt-1">طبقة أمان إضافية لحسابك</p>
          </div>
          <ToggleSwitch checked={twoFactorEnabled} onChange={onToggleTwoFactor} />
        </div>
        {twoFactorEnabled && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              تم تفعيل المصادقة الثنائية. سيتم طلب رمز تحقق عند كل تسجيل دخول.
            </p>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium mb-3">تغيير كلمة المرور</h3>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="كلمة المرور الحالية"
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="كلمة المرور الجديدة"
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="تأكيد كلمة المرور"
            className="w-full p-2 border rounded-lg"
          />
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            تحديث كلمة المرور
          </button>
        </div>
      </div>

      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <h3 className="font-medium text-red-600">إغلاق الحساب</h3>
        <p className="text-sm text-red-500 mt-1 mb-3">
          سيتم حذف جميع بياناتك بشكل دائم ولا يمكن استرجاعها
        </p>
        <button className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50">
          طلب إغلاق الحساب
        </button>
      </div>
    </div>
  </div>
);

const SocialLinksSection = ({ socialLinks, onUpdateLinks }) => {
  const [editing, setEditing] = useState(false);
  const [links, setLinks] = useState(socialLinks);

  const handleChange = (platform, value) => {
    setLinks(prev => ({ ...prev, [platform]: value }));
  };

  const handleSave = () => {
    onUpdateLinks(links);
    setEditing(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">روابط التواصل الاجتماعي</h2>
        {editing ? (
          <div className="flex space-x-2">
            <button 
              onClick={() => setEditing(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              إلغاء
            </button>
            <button 
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              حفظ
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setEditing(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            تعديل
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(links).map(([platform, url]) => (
          <div key={platform} className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {platform === 'facebook' && 'فيسبوك'}
              {platform === 'twitter' && 'تويتر'}
              {platform === 'linkedin' && 'لينكدإن'}
            </label>
            {editing ? (
              <input
                type="text"
                value={url}
                onChange={(e) => handleChange(platform, e.target.value)}
                className="w-full p-2 border rounded"
                placeholder={`${platform}.com/username`}
              />
            ) : (
              <a 
                href={url.startsWith('http') ? url : `https://${url}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {url || 'غير محدد'}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const PreferencesSection = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">التفضيلات</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">تفضيلات اللغة</h3>
        <select className="w-full p-2 border rounded-lg">
          <option>العربية</option>
          <option>English</option>
          <option>Français</option>
        </select>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">وضع العرض</h3>
        <div className="flex space-x-4">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
            فاتح
          </button>
          <button className="px-4 py-2 bg-gray-800 text-white rounded-lg">
            داكن
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">الإشعارات</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span>إشعارات البريد الإلكتروني</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span>إشعارات التطبيق</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">الخصوصية</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span>السماح بالبحث عني</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span>إظهار نشاطي للعامة</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

export default page;