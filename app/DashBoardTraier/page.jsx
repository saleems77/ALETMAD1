"use client";
import React from "react";
import Header from "./Header";
import ProfessionalSidebar from "./Sidebar";
import HomePage from "./HomePage";
import Footer from "@/components/Footer";
import { useAppSelector } from "@/hooks"; // تأكد من وجود هذا الملف

function Page() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div>
      <div className="flex">
        <ProfessionalSidebar />
        <div className="flex-1">
          <Header />
          
          {isAuthenticated && user && (
            <div className="p-4 bg-blue-100 border-b border-blue-200">
              <h1 className="text-2xl font-bold text-blue-800">
                مرحبًا {user.username} 👋
              </h1>
              <p className="text-blue-600 mt-1">
                يمكنك الآن البدء في استخدام المنصة
              </p>
            </div>
          )}

          <HomePage />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page;