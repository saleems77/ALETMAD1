// app/api/courses/route.js
import { NextResponse } from "next/server";
import { postStrapiData } from "@/lib/strapi";

// الدالة الأولى: لتعديل النسب (instructorShare, platformShare, ...)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // التأكد من أن المدخلات تحتوي على النسب فقط
    const updateData = {
      instructorShare: body.data.instructorShare,
      platformShare: body.data.platformShare,
      marketerShare: body.data.marketerShare,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/courses/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: updateData }),
      }
    );

    if (!response.ok) throw new Error("Failed to update course shares");

    const updatedCourse = await response.json();
    return NextResponse.json(updatedCourse);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update course shares: " + error.message },
      { status: 500 }
    );
  }
}

// الدالة الثانية: لإنشاء كورس جديد
export async function POST(request) {
  try {
    const body = await request.json();
    const data = await postStrapiData("/api/courses", body);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create course: " + error.message },
      { status: 500 }
    );
  }
}

// الدالة الثالثة: لتعديل الكورس (تم تغيير اسمها من PUT إلى PATCH)
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const data = await postStrapiData(`/api/courses/${id}`, body);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update course: " + error.message },
      { status: 500 }
    );
  }
}

// الدالة الرابعة: لحذف الكورس
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/courses/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to delete course");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete course: " + error.message },
      { status: 500 }
    );
  }
}
