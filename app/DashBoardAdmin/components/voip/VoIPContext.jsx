"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useVoIPStore = create(
  persist(
    (set, get) => ({
      activeCalls: [],
      contacts: [],
      isLoading: false,
      error: null,

      // بدء مكالمة جديدة
      startCall: (number) => {
        const newCall = {
          id: Date.now().toString(),
          number: number,
          status: "active",
          startTime: new Date().toLocaleTimeString(),
        };
        set((state) => ({
          activeCalls: [...state.activeCalls, newCall],
        }));
      },

      // إنهاء مكالمة محددة
      endCall: (id) =>
        set((state) => ({
          activeCalls: state.activeCalls.filter((call) => call.id !== id),
        })),
    }),
    {
      name: "voip-store", // اسم التخزين في localStorage
    }
  )
);
