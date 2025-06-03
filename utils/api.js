import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// تسجيل الدخول
export const login = async (email, password) => {
  const res = await api.post("/auth/local", {
    identifier: email,
    password,
  });
  return res.data;
};

// جلب المستخدمين
export const getUsers = async (token) => {
  const res = await api.get("/customusers", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// تحديث الصلاحيات
export const updatePermissions = async (userId, permissions, token) => {
  await api.put(
    `/customusers/${userId}`,
    {
      data: { permissions },
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
