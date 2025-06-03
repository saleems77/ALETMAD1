"use client";
import { create } from "zustand";
import { v4 as uuid } from "uuid";

/*
  تعريف المتجر باستخدام Zustand.
  تأكد من تمرير set و get في create لاستخدامهما داخل المتجر.
*/
const useAutomationStore = create((set, get) => ({
  campaigns: [],
  currentCampaign: null,
  nodes: [],
  edges: [],

  // إضافة عقدة جديدة
  addNode: (node) =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          id: uuid(),
          position: { x: 0, y: 0 },
          data: { label: node.type },
          type: node.type,
        },
      ],
    })),

  // التحقق من التوصيلات
  validateConnection: (connection) => {
    const sourceType = get().nodes.find(
      (n) => n.id === connection.source
    )?.type;
    const targetType = get().nodes.find(
      (n) => n.id === connection.target
    )?.type;

    // مثال: لا يمكن توصيل إيميل بشرط مباشرة
    if (sourceType === "email" && targetType === "condition") {
      return false;
    }
    return true;
  },
}));

export default useAutomationStore;
