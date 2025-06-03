module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      outlineColor: ({ theme }) => ({
        ring: theme("colors.ring") + "50", // أضف الشفافية 50 هنا
      }),
      borderColor: ({ theme }) => ({
        // أضف هذا القسم
        border: theme("colors.border"),
      }),
      screens: { md: "768px" },
      fontFamily: {
        sans: ["var(--font-cairo)", "Arial", "sans-serif"],
        cairo: ["var(--font-cairo)", "Arial", "sans-serif"],
        "din-next": ["DIN Next Arabic", "sans-serif"],
      },
      colors: {
        blue: "#008DCB",
        black: "#0D1012",
        gray: "#999999",
        red: "#E2101E",
        yellow: "#F9D011",
        ring: "var(--ring)", // تأكد من وجود هذا التعريف

        border: "var(--border)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        "wave-primary": "#3B82F6",
        "wave-progress": "#2563EB",
        "media-control": "rgba(0, 0, 0, 0.7)",
        "license-premium": "#8B5CF6",
        "license-educational": "#10B981",
        purple: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          500: "#8B5CF6",
          600: "#7C3AED",
        },
      },
      boxShadow: {
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        soft: "0 4px 24px rgba(0, 0, 0, 0.08)",
        hard: "0 8px 32px rgba(13, 16, 18, 0.12)",
      },
    },
  },
  plugins: [],
};
