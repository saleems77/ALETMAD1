// lib/auth.js
import axios from "axios";

export const login = async (email, password) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local`,
    {
      identifier: email,
      password,
    }
  );

  if (res.data.jwt) {
    localStorage.setItem("jwt", res.data.jwt);
    return res.data.user;
  }
};

export const getCurrentUser = async () => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) return null;

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );

  return res.data;
};
