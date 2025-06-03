// lib/api/auth.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/local/register", {
      username: userData.name,
      email: userData.email,
      password: userData.password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/local", {
      identifier: credentials.email,
      password: credentials.password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
