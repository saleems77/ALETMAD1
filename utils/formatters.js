// src/utils/formatters.js

/**
 * تنسيق التاريخ حسب المنطقة
 * @param {string} dateStr - تاريخ بصيغة ISO (YYYY-MM-DD)
 * @returns {string} تاريخ منسق
 */
export const formatDate = (dateStr) => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date)) throw new Error("تاريخ غير صالح");

    return new Intl.DateTimeFormat("ar-SA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      calendar: "gregory",
    }).format(date);
  } catch (error) {
    console.error("خطأ في تنسيق التاريخ:", error.message);
    return "تاريخ غير معروف";
  }
};

/**
 * تنسيق العملات العربية
 * @param {number} amount - المبلغ الرقمي
 * @param {string} currency - رمز العملة (SAR, USD, ...)
 * @returns {string} مبلغ مالي منسق
 */
export const formatCurrency = (amount, currency = "SAR") => {
  try {
    if (typeof amount !== "number") throw new Error("نوع المبلغ غير صحيح");

    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: currency,
      currencyDisplay: "symbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error("خطأ في تنسيق العملة:", error.message);
    return "مبلغ غير متوفر";
  }
};

/**
 * تنسيق الأرقام العربية مع الفواصل
 * @param {number} number - الرقم المدخل
 * @returns {string} رقم منسق
 */
export const formatNumber = (number) => {
  try {
    return new Intl.NumberFormat("ar-SA").format(number);
  } catch (error) {
    console.error("خطأ في تنسيق الرقم:", error.message);
    return "--";
  }
};

/**
 * تقصير النصوص الطويلة
 * @param {string} text - النص الأصلي
 * @param {number} maxLength - الحد الأقصى للحروف
 * @returns {string} نص مختصر
 */
export const truncateText = (text, maxLength = 50) => {
  if (typeof text !== "string") return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// دالة مساعدة للتحويل إلى أرقام عربية
const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
export const toArabicNumerals = (num) => {
  return num.toString().replace(/\d/g, (d) => arabicNumbers[d] || d);
};
