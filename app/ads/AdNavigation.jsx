// AdNavigation.jsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdNavigation = () => {
  const pathname = usePathname();
  
  const navItems = [
    { name: "اللوحة الرئيسية", href: "/ads/adss", icon: "📊" },
    { name: "الحملات الإعلانية", href: "/ads/adss/campaigns", icon: "🚀" },
    { name: "مجموعات الإعلانات", href: "/ads/adss/ad-sets", icon: "📦" },
    { name: "الإعلانات", href: "/ads/adss/ads", icon: "📢" },
    { name: "حساب المعلن", href: "/ads/adss/account", icon: "👤" },
    { name: "التقارير", href: "/ads/adss/reports", icon: "📈" }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
              pathname === item.href
                ? "bg-blue-100 text-blue-800 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdNavigation;