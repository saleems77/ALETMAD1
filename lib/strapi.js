// lib/strapi.js
export async function getStrapiData(endpoint) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${endpoint}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) throw new Error(`Failed to fetch data from ${endpoint}`);
  return res.json();
}

export async function postStrapiData(endpoint, data) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${endpoint}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    }
  );

  if (!res.ok) throw new Error(`Failed to post data to ${endpoint}`);
  return res.json();
}
