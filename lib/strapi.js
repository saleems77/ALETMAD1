// lib/strapi.js
export const getStrapiData = async (endpoint) => {
  if (!process.env.NEXT_PUBLIC_STRAPI_API_URL) {
    throw new Error("NEXT_PUBLIC_STRAPI_API_URL غير معرف");
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${endpoint}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    // التحقق مما إذا كان الرد HTML
    const text = await res.text();
    console.error("Response was not JSON:", text);
    throw new Error(`فشل في جلب البيانات: ${res.status} ${res.statusText}`);
  }

  return res.json();
};
export const createStrapiData = async (endpoint, data) => {
  if (!process.env.NEXT_PUBLIC_STRAPI_API_URL) {
    throw new Error("NEXT_PUBLIC_STRAPI_API_URL غير معرف");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);
  const jwt = localStorage.getItem("jwt");
  if (!jwt) throw new Error("المصادقة مطلوبة");

  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${endpoint}`;
    const res = await fetch(url, {
      signal: controller.signal,
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    clearTimeout(timeout);

    if (!res.ok) {
      let errorMsg = `فشل في إرسال البيانات: ${res.status}`;
      try {
        const errorData = await res.json();
        errorMsg = errorData.error?.message || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }
    return await res.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("الطلب استغرق وقتًا طويلًا");
    }
    throw error;
  }
};
export const postStrapiData = async (endpoint, data) => {
  if (!process.env.NEXT_PUBLIC_STRAPI_API_URL) {
    throw new Error("NEXT_PUBLIC_STRAPI_API_URL غير معرف");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);

  const jwt = localStorage.getItem("jwt");
  if (!jwt) throw new Error("المصادقة مطلوبة");

  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${endpoint}`;
    console.log("Request URL:", url); // للمساعدة في التشخيص

    const res = await fetch(url, {
      signal: controller.signal,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      let errorMsg = `فشل في تحديث البيانات: ${res.status}`;
      try {
        const errorData = await res.json();
        errorMsg = errorData.error?.message || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("الطلب استغرق وقتاً طويلاً");
    }
    throw error;
  }
};
