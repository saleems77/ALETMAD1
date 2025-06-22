import { toast } from "react-hot-toast";

export const useToast = () => {
  return {
    toast: (options) => {
      if (options.variant === "destructive") {
        return toast.error(options.description, {
          icon: "❌",
          style: {
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
          },
        });
      }

      toast(options.description, {
        icon: options.title === "🎉 تم إنشاء الحملة!" ? "🎉" : "ℹ️",
        style: {
          backgroundColor: options.style?.backgroundColor || "#dbeafe",
          color: options.style?.color || "#1d4ed8",
          border: "1px solid #bfdbfe",
        },
      });
    },
  };
};
