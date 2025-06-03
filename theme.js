// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  shadows: [
    "none",
    "0px 2px 1px -1px rgba(0,0,0,0.2)",
    "0px 3px 1px -2px rgba(0,0,0,0.2)",
    // ... أضف 25 عنصرًا حسب الحاجة
    "0px 5px 5px -3px rgba(0,0,0,0.2)",
  ],
  palette: {
    // الألوان الأساسية
    primary: {
      main: "#1976d2", // اللون الأساسي
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
      light: "#ff5c8d",
      dark: "#9a0036",
    },
    // إضافة قسم التدرجات إذا كنت تحتاجه
    gradient: {
      primary: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    },
    // الخلفيات الافتراضية
    background: {
      default: "#f5f5f5", // لون الخلفية الافتراضي
      paper: "#ffffff", // لون خلفية العناصر
    },
  },
});

export default theme;
