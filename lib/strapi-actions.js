"use server";
import { cookies } from "next/headers";

export async function registerUser(prevState, formData) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/local/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          username: formData.get("username"),
          email: `${formData.get("phone")}@example.com`,
          password: formData.get("password"),
          phone: formData.get("phone"),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error?.message || "حدث خطأ أثناء التسجيل",
      };
    }

    // حفظ الجلسة
    cookies().set("strapi_jwt", data.jwt, {
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // أسبوع
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error); // استخدام المتغير
    return {
      error: "فشل الاتصال بالخادم",
    };
  }
}
