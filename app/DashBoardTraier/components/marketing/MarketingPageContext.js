import { create } from "zustand";

export const useMarketingPageStore = create((set) => ({
  pages: [],
  currentPage: null,
  templates: [],
  setPages: (pages) => set({ pages }),
  setCurrentPage: (page) => set({ currentPage: page }),
  addPage: (newPage) => set((state) => ({ pages: [...state.pages, newPage] })),
  updatePage: (updatedPage) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === updatedPage.id ? updatedPage : page
      ),
    })),
}));
