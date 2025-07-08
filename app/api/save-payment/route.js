import { NextResponse } from "next/server";
import { createPayment } from "@/lib/strapistripe"; // قم بإنشاء هذا الملف لاحقًا

export async function POST(request) {
  const paymentData = await request.json();

  try {
    const savedPayment = await createPayment(paymentData);
    return NextResponse.json(savedPayment);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
