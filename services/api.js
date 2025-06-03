import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  timeout: 10000,
});

axios.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (auth?.jwt) {
    config.headers.Authorization = `Bearer ${auth.jwt}`;
  }
  return config;
});
export const checkAuth = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/me?populate=role`);
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
export default {
  getUserTracks: (userId) =>
    api.get(
      `/tracks?filters[users_permissions_user][id][$eq]=${userId}&populate=*`
    ),
  createTrack: (data) => api.post("/tracks", data),
  updateTrack: (id, data) => api.put(`/tracks/${id}`, data),
  deleteTrack: (id) => api.delete(`/tracks/${id}`),
};
