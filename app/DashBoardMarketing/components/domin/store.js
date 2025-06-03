import { create } from "zustand";

export const useIntegratedStore = create((set) => ({
  domains: [],
  templates: [
    {
      id: "template1",
      name: "قالب المتجر الإلكتروني",
      description: "قالب متكامل للمتاجر الإلكترونية مع دعم الدفع والتوصيل",
      thumbnail: "/templates/ecommerce.jpg",
      category: "ecommerce",
      rating: 4.8,
      isPremium: false,
    },
    {
      id: "template2",
      name: "قالب السيرة الذاتية",
      description: "قالب احترافي لعرض الأعمال والمهارات الشخصية",
      thumbnail: "/templates/portfolio.jpg",
      category: "portfolio",
      rating: 4.5,
      isPremium: true,
    },
  ],
  currentDomain: null,
  currentTemplate: null,
  connection: {
    status: "disconnected",
    endpoint: "",
    apiKey: "",
  },
  linkTemplate: (templateId) =>
    set((state) => ({
      currentTemplate: state.templates.find((t) => t.id === templateId),
    })),
  // Actions
  setCurrentDomain: (domain) => set({ currentDomain: domain }),

  addDomain: (domain) =>
    set((state) => ({
      domains: [
        ...state.domains,
        {
          ...domain,
          id: Date.now(),
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ],
      currentDomain: domain,
    })),

  verifyDomain: (id) =>
    set((state) => ({
      domains: state.domains.map((d) =>
        d.id === id ? { ...d, status: "verified" } : d
      ),
    })),

  deleteDomain: (id) =>
    set((state) => ({
      domains: state.domains.filter((d) => d.id !== id),
      currentDomain:
        state.currentDomain?.id === id ? null : state.currentDomain,
    })),

  updateConnection: (config) =>
    set({
      connection: { ...config, status: "connected" },
    }),
}));
