import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Interceptor لإضافة التوكن لكل الطلبات
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// وظيفة للتحقق مما إذا كان هناك كورسات مرتبطة
export const getCoursesByTrackId = async (trackId) => {
  try {
    const response = await api.get(
      `/courses?filters[track][id][$eq]=${trackId}`
    );
    return response; // سيحتوي على response.data.data.length > 0 إذا كانت هناك كورسات
  } catch (error) {
    console.error("فشل في جلب الكورسات:", error);
    throw error;
  }
};

// وظيفة لفحص حالة المستخدم (موجودة)
export const checkAuth = async () => {
  try {
    const response = await api.get("/users/me?populate=role");
    return {
      user: response.data,
      jwt: localStorage.getItem("jwt"),
    };
  } catch (error) {
    console.error("Auth check failed:", error);
    localStorage.removeItem("auth");
    throw error;
  }
};

// وظائف المسارات
export default {
  getUserTracks: (userId) =>
    api.get(
      `/tracks?filters[users_permissions_user][id][$eq]=${userId}&fields[0]=name&fields[1]=description&fields[2]=numOfCourse&fields[3]=createdAt`
    ),
  createTrack: (data) =>
    api.post(
      "/tracks",
      { data },
      {
        // لف البيانات داخل { data }
        headers: { "Content-Type": "application/json" },
      }
    ),
  updateTrack: (documentId, data) =>
    api.put(
      `/tracks/${documentId}`,
      { data },
      {
        headers: { "Content-Type": "application/json" },
      }
    ),
  deleteTrack: (id) => api.delete(`/tracks/${id}`),
  getCoursesByTrackId: (trackId) =>
    api.get(`/courses?filters[track][id][$eq]=${trackId}`),
};
