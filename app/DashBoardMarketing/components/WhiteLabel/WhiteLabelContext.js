import { create } from "zustand";

export const useBrandStore = create((set) => ({
  brands: [],
  currentBrand: {
    logo: "/default-logo.png",
    primaryColor: "#4F46E5",
    secondaryColor: "#10B981",
    font: "Inter",
  },
  updateBrand: (newSettings) => set({ currentBrand: { ...newSettings } }),
}));
