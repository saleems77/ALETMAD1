"use client";

import React from "react";
import CallPanel from "./CallPanel";
import ContactDirectory from "./ContactDirectory";
import ActiveCalls from "./ActiveCalls";
import { useVoIPStore } from "./VoIPContext";
import CallTimeline from "./CallTimeline";

export default function VoipDashboard() {
  // هنا يمكن استخدام activeCalls إن احتجت، ولكن في هذا المثال يتم تمريره ضمن مكونات أخرى
  const { activeCalls } = useVoIPStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* القسم الرئيسي: يحتوي على لوحة المكالمات وجدول المكالمات */}
      <div className="lg:col-span-2 space-y-6">
        <CallPanel />
        <CallTimeline />
      </div>

      {/* الجانب الأيمن: يحتوي على المكالمات النشطة ودليل جهات الاتصال */}
      <div className="space-y-6">
        <ActiveCalls />
        <ContactDirectory />
      </div>
    </div>
  );
}
