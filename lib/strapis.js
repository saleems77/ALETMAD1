// lib/strapi.js
import qs from "qs";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

export const fetchFromStrapi = async (endpoint, params = {}) => {
  try {
    const query = qs.stringify(params, { encodeValuesOnly: true });
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${endpoint}?${query}`;

    const res = await fetch(url);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `HTTP error! status: ${res.status}, message: ${errorText}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
};

export const postToStrapi = async (endpoint, data) => {
  // تحويل التواريخ إلى صيغة Strapi
  const formattedData = {
    ...data,
    schedule: new Date(data.schedule).toISOString().split("T")[0], // من "2025-06-23T19:26:55.000Z" إلى "2025-06-23"
    publishedAt: new Date().toISOString().split("T")[0], // إضافة تاريخ نشر تلقائي
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: formattedData }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
  }

  return res.json();
};
export const updateStrapi = async (endpoint, documentId, data) => {
  const res = await fetch(`${STRAPI_URL}/${endpoint}/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    throw new Error(`Error updating ${endpoint}`);
  }

  return res.json();
};

export const deleteFromStrapi = async (endpoint, documentId) => {
  const res = await fetch(`${STRAPI_URL}/${endpoint}/${documentId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Error deleting ${endpoint}`);
  }

  return res.json();
};
