"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile, updateProfile } from "../../store/slices/profileSlice";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const AccountSettings = () => {
  const dispatch = useDispatch();
  const { data: profile, status, error } = useSelector((state) => state.profile);
  const { user, token } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: "",
    website: "",
    jobTitle: "",
    phone: "",
    facebookLink: "",
    bio: "",
    profileImage: null,
    profileImageFile: null,
  });

  const [uploadedImageId, setUploadedImageId] = useState(null);

  useEffect(() => {
    if (token && user?.documentId && status === "idle") {
      dispatch(fetchProfile({ 
        documentId: user.documentId, 
        token 
      }));
    }
  }, [token, user, status, dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        website: profile.website || "",
        jobTitle: profile.jobTitle || "",
        phone: profile.phone || "",
        facebookLink: profile.facebookLink || "",
        bio: profile.bio || "",
        profileImage: profile.profileImage || null,
        profileImageFile: null,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formDataImage = new FormData();
      formDataImage.append("files", file);

      try {
        const uploadRes = await axios.post(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/upload`,
          formDataImage,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUploadedImageId(uploadRes.data[0].id);
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData((prev) => ({
            ...prev,
            profileImage: { url: e.target.result },
            profileImageFile: file
          }));
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("فشل رفع الصورة:", error);
        toast.error("فشل رفع الصورة: " + error.message);
      }
    }
  };

  const handleUpdate = () => {
    if (!profile?.documentId) {
      toast.error("بيانات الملف الشخصي غير مكتملة");
      return;
    }

    dispatch(updateProfile({
      profileDocumentId: profile.documentId,
      profileData: {
        ...formData,
        ...(uploadedImageId && { profileImage: uploadedImageId }),
      },
      token
    })).then((result) => {
      if (updateProfile.fulfilled.match(result)) {
        toast.success("تم تحديث البيانات بنجاح!");
      } else {
        toast.error("فشل تحديث البيانات: " + (result.payload || ""));
      }
    });
  };

  if (status === "loading" || status === "updating") {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#008DCB]"></div>
        <span className="mt-4 text-lg text-[#0D1012]">جاري تحميل البيانات...</span>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="bg-[#FFF5F5] border-l-4 border-[#E2101E] p-4 my-6 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-[#E2101E]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-[#0D1012]">
              فشل في تحميل بيانات المستخدم: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6" dir="rtl">
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '12px',
            padding: '16px',
            fontWeight: 500,
          },
          success: {
            style: {
              background: '#E6F7FF',
              color: '#008DCB',
              border: '1px solid #008DCB',
            },
          },
          error: {
            style: {
              background: '#FFF5F5',
              color: '#E2101E',
              border: '1px solid #E2101E',
            },
          },
        }}
      />
      
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#0D1012]">إعدادات الحساب الشخصي</h1>
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#f0f0f0]">
        {/* رأس البطاقة الشخصية */}
        <div className="bg-gradient-to-r from-[#008DCB] to-[#2CA9E1] p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center">
            {/* الصورة الشخصية */}
            <div className="mb-6 md:mb-0 md:mr-8 relative">
              <div className="relative">
                {formData.profileImage ? (
                  <img
                   src={
                    formData.profileImage.url?.startsWith('http') 
                      ? formData.profileImage.url 
                      : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${formData.profileImage.url}`
                  }
                    alt="الصورة الشخصية"
                    className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="bg-[#f5f5f5] border-2 border-dashed border-[#999999] rounded-full w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                    <span className="text-[#999999]">لا توجد صورة</span>
                  </div>
                )}
                <label className="absolute -bottom-2 -right-2 bg-[#F9D011] rounded-full p-2 shadow-lg cursor-pointer hover:bg-[#e1b900] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0D1012]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 00-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 005.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </label>
              </div>
            </div>
            
            {/* المعلومات الأساسية */}
            <div className="text-center md:text-right">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{formData.username}</h2>
              {formData.website && (
                <p className="text-white/90 mt-1">{formData.website}</p>
              )}
              {formData.jobTitle && (
                <p className="text-[#F9D011] font-medium mt-2 bg-[#0D1012]/20 px-3 py-1 rounded-full inline-block">
                  {formData.jobTitle}
                </p>
              )}
              <p className="text-white/80 text-sm mt-3">معرف المستخدم: {user?.documentId}</p>
            </div>
          </div>
        </div>
        
        {/* تفاصيل الحساب */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* معلومات الحساب */}
            <div>
              <div className="flex items-center mb-6 pb-2 border-b border-[#999999]/30">
                <div className="bg-[#008DCB]/10 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-[#008DCB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#0D1012]">معلومات الحساب</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#0D1012] mb-2">اسم المستخدم</label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3.5 border border-[#999999]/40 rounded-xl focus:ring-2 focus:ring-[#008DCB]/30 focus:border-[#008DCB] transition-all"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D1012] mb-2">البريد الإلكتروني</label>
                  <input
                    value={formData.website}
                    className="w-full p-3.5 border border-[#999999]/40 rounded-xl focus:ring-2 focus:ring-[#008DCB]/30 focus:border-[#008DCB] transition-all"
                    readOnly
                  />
                </div>
              </div>
            </div>
            
            {/* المعلومات الشخصية */}
            <div>
              <div className="flex items-center mb-6 pb-2 border-b border-[#999999]/30">
                <div className="bg-[#008DCB]/10 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-[#008DCB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#0D1012]">المعلومات الشخصية</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#0D1012] mb-2">المسمى الوظيفي</label>
                  <input
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full p-3.5 border border-[#999999]/40 rounded-xl focus:ring-2 focus:ring-[#008DCB]/30 focus:border-[#008DCB] transition-all"
                    placeholder="مثال: مطور ويب"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D1012] mb-2">رقم الهاتف</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3.5 border border-[#999999]/40 rounded-xl focus:ring-2 focus:ring-[#008DCB]/30 focus:border-[#008DCB] transition-all"
                    placeholder="مثال: +966123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D1012] mb-2">رابط الفيسبوك</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-[#999999]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                      </svg>
                    </div>
                    <input
                      name="facebookLink"
                      value={formData.facebookLink}
                      onChange={handleChange}
                      className="w-full pl-10 p-3.5 border border-[#999999]/40 rounded-xl focus:ring-2 focus:ring-[#008DCB]/30 focus:border-[#008DCB] transition-all"
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* السيرة الذاتية */}
          <div className="mt-8">
            <div className="flex items-center mb-6 pb-2 border-b border-[#999999]/30">
              <div className="bg-[#008DCB]/10 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-[#008DCB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0D1012]">السيرة الذاتية</h3>
            </div>
            
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-3.5 border border-[#999999]/40 rounded-xl focus:ring-2 focus:ring-[#008DCB]/30 focus:border-[#008DCB] transition-all h-40"
              placeholder="أخبرنا عن نفسك..."
            />
            <p className="text-sm text-[#999999] mt-2">يمكنك كتابة 500 حرف كحد أقصى</p>
          </div>
          
          {/* زر الحفظ */}
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleUpdate}
              disabled={status === "updating"}
              className={`px-8 py-3.5 rounded-xl font-medium flex items-center transition-all ${
                status === "updating"
                  ? "bg-[#999999] cursor-not-allowed"
                  : "bg-[#008DCB] hover:bg-[#0077b3] text-white shadow-md hover:shadow-lg"
              }`}
            >
              {status === "updating" ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 016 6h2a8 8 0 01-8 8v-2a6 6 0 01-6-6H4z"></path>
                  </svg>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;