// components/ui/use-toast.js
import { useState } from "react";

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (newToast) => {
    setToast(newToast);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return { toast, showToast };
};
