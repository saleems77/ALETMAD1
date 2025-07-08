import axios from "axios";

const strapiAPI = axios.create({
  baseURL: process.env.STRAPI_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  },
});

export async function createPayment(paymentData) {
  try {
    const response = await strapiAPI.post("/payments", { data: paymentData });
    return response.data;
  } catch (error) {
    console.error("Error creating payment in Strapi:", error);
    throw error;
  }
}
