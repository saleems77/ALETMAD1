// src/contexts/LanguageContext.js
"use client";
import React, { createContext, useState, useEffect, useContext } from "react"; // أضف useContext هنا

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("ar");
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // تحميل ملفات الترجمة
    const loadTranslations = async () => {
      const langModule = await import(`@/lang/${language}.json`);
      setTranslations(langModule.default);
    };

    // استعادة اللغة من localStorage إن وجدت
    const savedLang = localStorage.getItem("lang") || "ar";
    setLanguage(savedLang);
    loadTranslations();
  }, [language]);

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  return (
    <LanguageContext.Provider
      value={{ language, toggleLanguage, t: translations }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
export const useLanguage = () => useContext(LanguageContext); // أصبح الآن يعمل بشكل صحيح
