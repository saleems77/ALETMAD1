import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

export const fetchInternalUsers = async () => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${API_URL}/internal-users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data || []; // إرجاع مصفوفة فارغة كقيمة افتراضية
  } catch (error) {
    throw new Error("فشل في جلب البيانات" + error.message);
  }
};

// إنشاء مستخدم جديد
export const createInternalUser = async (userData, token) => {
  if (!token) {
    throw new Error("التوكن غير موجود");
  }

  try {
    const response = await axios.post(`${API_URL}/internal-users`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("فشل في إنشاء المستخدم:", error);
    throw error;
  }
};
// تحديث مستخدم موجود
export const updateInternalUser = async (userId, userData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/internal-users/${userId}`,
      userData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("فشل في تحديث المستخدم: " + error.message);
  }
};

// حذف مستخدم
export const deleteInternalUser = async (userId, token) => {
  try {
    await axios.delete(`${API_URL}/internal-users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return userId; // إرجاع ID المستخدم المحذوف
  } catch (error) {
    throw new Error("فشل في حذف المستخدم: " + error.message);
  }
};

// جلب مستخدم واحد بواسطة ID
export const fetchInternalUserById = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/internal-users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error("فشل في جلب بيانات المستخدم: " + error.message);
  }
};
export const ROLES = {
  ADMIN: "PlatformAdmin",
  ASSISTANT: "Assistant",
  // ...أدوار أخرى
};
// ------ خدمات إضافية ------

// تحديث كلمة المرور (مثال)
export const updateUserPassword = async (userId, newPassword, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/internal-users/${userId}/password`,
      { password: newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("فشل في تحديث كلمة المرور: " + error.message);
  }
};

// تفعيل/تعطيل المستخدم
export const toggleUserStatus = async (userId, isActive, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/internal-users/${userId}/status`,
      { active: isActive },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("فشل في تحديث حالة المستخدم: " + error.message);
  }
};
