// mocks/couponData.js
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
import qs from "qs"; // ✅ الاستيراد المفقود

// إنشاء كوبون جديد في Strapi
export const generateCoupon = async (courseId, discount, expiry) => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${API_URL}/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          code: `COUPON-${Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()}`, // كود عشوائي
          discount: discount,
          expiresAt: expiry,
          course: courseId,
        },
      }),
    });

    if (!response.ok) throw new Error("فشل إنشاء الكوبون");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("خطأ في إنشاء الكوبون:", error);
    throw error;
  }
};

// جلب الكوبونات من Strapi
// mocks/couponData.js

// mocks/couponData.js

export const getCoupons = async (courseDocumentId) => {
  try {
    const token = localStorage.getItem("jwt");

    // التحقق من توفر التوكن ومعرف الدورة
    if (!token || !courseDocumentId) {
      throw new Error("التوكن أو معرف الدورة غير متوفر");
    }

    // بناء استعلام الفلترة باستخدام documentId
    const query = qs.stringify(
      {
        filters: {
          course: {
            documentId: {
              $eq: courseDocumentId,
            },
          },
        },
      },
      { encodeValuesOnly: true }
    );

    // تنفيذ الطلب
    const response = await fetch(`${API_URL}/coupons?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // في حالة عدم وجود كوبونات، نعيد مصفوفة فارغة بدلاً من رمي خطأ
    if (!response.ok) {
      console.warn(`لم يتم العثور على كوبونات للدورة ${courseDocumentId}`);
      return [];
    }

    const data = await response.json();

    // التأكد من أن البيانات تحتوي على الحقول المتوقعة
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.warn("البيانات المستلمة غير صالحة أو فارغة");
      return [];
    }

    return data.data;
  } catch (error) {
    console.error("خطأ في جلب الكوبونات:", error);
    return []; // إرجاع مصفوفة فارغة في حالة الخطأ
  }
};

// إنشاء رابط دعوة جديد في Strapi
export const generateInvitationLink = async (courseId) => {
  try {
    const token = localStorage.getItem("jwt");
    const linkCode = `LINK-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
    const response = await fetch(`${API_URL}/invitation-links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          linkCode: linkCode,
          course: courseId,
        },
      }),
    });

    if (!response.ok) throw new Error("فشل إنشاء رابط الدعوة");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("خطأ في إنشاء رابط الدعوة:", error);
    throw error;
  }
};
// couponData.js
export const getInvitationLinks = async (courseDocumentId) => {
  try {
    const token = localStorage.getItem("jwt");

    // التحقق من توفر التوكن ومعرف الدورة
    if (!token || !courseDocumentId) {
      throw new Error("التوكن أو معرف الدورة غير متوفر");
    }

    // بناء استعلام الفلترة باستخدام documentId
    const query = qs.stringify(
      {
        filters: {
          course: {
            documentId: {
              $eq: courseDocumentId,
            },
          },
        },
      },
      { encodeValuesOnly: true }
    );

    // تنفيذ الطلب
    const response = await fetch(`${API_URL}/invitation-links?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // في حالة عدم وجود روابط دعوة، نعيد مصفوفة فارغة
    if (!response.ok) {
      console.warn(`لم يتم العثور على روابط دعوة للدورة ${courseDocumentId}`);
      return [];
    }

    const data = await response.json();

    // التأكد من أن البيانات تحتوي على الحقول المتوقعة
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.warn("البيانات المستلمة غير صالحة أو فارغة");
      return [];
    }

    return data.data;
  } catch (error) {
    console.error("خطأ في جلب روابط الدعوة:", error);
    return []; // إرجاع مصفوفة فارغة في حالة الخطأ
  }
};
