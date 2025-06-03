"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  X,
  Home,
  Users,
  Calendar,
  Settings,
} from "lucide-react";

// تعريف الثوابت للوحات التحكم
const DASHBOARDS = [
  { id: "instructor", label: "لوحة المدرب", url: "/DashBoardTraier" },
  { id: "admin", label: "لوحة الإدارة", url: "/DashBoaredAdmin" },
  { id: "student", label: "لوحة الطالب", url: "/DashBoardStudent" },
  { id: "employee", label: "لوحة الموظف", url: "/DashBoardEmployee" },
  { id: "wakiil", label: "لوحة الوكيل", url: "/DashBoardWakil" },
  { id: "assist", label: "لوحة المساعد", url: "/DashBoardAssist" },
];

// تعريف القوائم الفرعية
const SUB_MENUS = {
  instructor: [
    {
      title: "إدارة الدورات",
      icon: Home,
      subItems: [
        { title: "الدورات النشطة", url: "/instructor/courses/active" },
        { title: "المسودات", url: "/instructor/courses/drafts" },
      ],
    },
    {
      title: "الإحصائيات",
      icon: Calendar,
      subItems: [
        { title: "المبيعات", url: "/instructor/analytics/sales" },
        { title: "الطلاب", url: "/instructor/analytics/students" },
      ],
    },
  ],
  admin: [
    {
      title: "إدارة المستخدمين",
      icon: Users,
      subItems: [
        { title: "المدرسين", url: "/admin/users/instructors" },
        { title: "الطلاب", url: "/admin/users/students" },
      ],
    },
    {
      title: "الإعدادات",
      icon: Settings,
      subItems: [
        { title: "عامة", url: "/admin/settings/general" },
        { title: "الدفعيات", url: "/admin/settings/payments" },
      ],
    },
  ],
  student: [
    {
      title: "تعلم",
      icon: Home,
      subItems: [
        { title: "دوراتي", url: "/student/courses" },
        { title: "التقدم", url: "/student/progress" },
      ],
    },
    {
      title: "الملف الشخصي",
      icon: Users,
      subItems: [
        { title: "الإعدادات", url: "/student/profile/settings" },
        { title: "الشهادات", url: "/student/profile/certificates" },
      ],
    },
  ],
};

// تعريف الأزرار الإضافية
const EXTRA_BUTTONS = {
  instructor: [
    { label: "إنشاء دورة جديدة", url: "/courses/new", icon: Calendar },
    { label: "التقارير الشهرية", url: "/reports/monthly", icon: Settings },
  ],
  admin: [
    { label: "إضافة مستخدم جديد", url: "/admin/users/new", icon: Users },
    { label: "إعدادات النظام", url: "/admin/system-settings", icon: Settings },
  ],
  student: [
    { label: "طلب استشارة", url: "/student/consultation", icon: Users },
    { label: "الدعم الفني", url: "/student/support", icon: Settings },
  ],
};

export default function AppSidebar({ variant }) {
  const pathname = usePathname();
  const [activePanel, setActivePanel] = useState("instructor");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // تحديد اللوحة النشطة بناء على المسار الحالي
  useEffect(() => {
    const currentPanel = DASHBOARDS.find((d) =>
      pathname.startsWith(d.url)
    )?.id;
    if (currentPanel) setActivePanel(currentPanel);
    setActiveDropdown(null);
    setIsSidebarOpen(false);
  }, [pathname]);

  // إغلاق القوائم المنسدلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // واجهة الهيدر
  if (variant === "header") {
    return (
      <nav className="fixed top-0 left-0 w-full h-16 bg-white shadow-lg z-50">
        <div className="flex flex-col lg:flex-row h-full px-4 lg:items-center lg:justify-between">
          {/* روابط لوحات التحكم */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
            {DASHBOARDS.map((dashboard) => (
              <Link
                key={dashboard.id}
                href={dashboard.url}
                className={`p-3 lg:px-4 lg:py-2 rounded-lg ${
                  activePanel === dashboard.id
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {dashboard.label}
              </Link>
            ))}
          </div>

          {/* الأزرار الإضافية */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
            {EXTRA_BUTTONS[activePanel]?.map((button) => (
              <Link
                key={button.label}
                href={button.url}
                className="p-3 lg:px-3 lg:py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
              >
                {button.icon && <button.icon className="w-5 h-5" />}
                <span>{button.label}</span>
              </Link>
            ))}
          </div>

          {/* القوائم المنسدلة للهيدر */}
          <div className="hidden lg:flex items-center gap-4" ref={dropdownRef}>
            {SUB_MENUS[activePanel]?.map((item, index) => (
              <div
                key={item.title}
                className="relative"
                // فتح/إغلاق القائمة بالنقر
                onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                // فتح القائمة بالهاڤر
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {/* محتويات القائمة المنسدلة */}
                <div
                  className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg transition-all duration-300 z-50 ${
                    activeDropdown === index
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                >
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.url}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      // إغلاق القائمة عند النقر على عنصر
                      onClick={() => setActiveDropdown(null)}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  // واجهة الشريط الجانبي للجوال
  return (
    <>
      {/* زر فتح الشريط الجانبي */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* الشريط الجانبي المفتوح */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white shadow-lg h-full overflow-y-auto">
            {/* رأس الشريط الجانبي */}
            <div className="p-4 border-b flex justify-between items-center">
              <span className="font-bold">القائمة</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1">
                <X size={24} />
              </button>
            </div>

            {/* روابط لوحات التحكم */}
            <div className="p-4">
              {DASHBOARDS.map((dashboard) => (
                <Link
                  key={dashboard.id}
                  href={dashboard.url}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`block p-3 rounded-lg mb-2 ${
                    activePanel === dashboard.id
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {dashboard.label}
                </Link>
              ))}
            </div>

            {/* الأزرار الإضافية */}
            <div className="p-4 border-t">
              {EXTRA_BUTTONS[activePanel]?.map((button) => (
                <Link
                  key={button.label}
                  href={button.url}
                  onClick={() => setIsSidebarOpen(false)}
                  className="block p-3 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 mb-2"
                >
                  {button.icon && <button.icon className="w-5 h-5" />}
                  <span>{button.label}</span>
                </Link>
              ))}
            </div>

            {/* القوائم المنسدلة للشريط الجانبي */}
            <div className="p-4 border-t">
              {SUB_MENUS[activePanel]?.map((item, index) => (
                <div key={item.title} className="mb-4">
                  <button
                    onClick={() =>
                      setActiveDropdown(activeDropdown === index ? null : index)
                    }
                    className="w-full flex justify-between items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {/* محتويات القائمة المنسدلة */}
                  {activeDropdown === index && (
                    <div className="pl-6">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.url}
                          onClick={() => {
                            setIsSidebarOpen(false);
                            setActiveDropdown(null);
                          }}
                          className="block p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* طبقة التعتيم خارج الشريط الجانبي */}
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="flex-1 bg-black/50"
          />
        </div>
      )}
    </>
  );
}