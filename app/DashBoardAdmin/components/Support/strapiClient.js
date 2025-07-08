export async function fetchStrapi(endpoint, options = {}) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  // Only access localStorage in client-side
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("jwt");
  }

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${STRAPI_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || "API Error");
  }

  return res.json();
}
