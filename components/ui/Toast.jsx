// components/ui/Toast.jsx
"use client"
import { motion, AnimatePresence } from 'framer-motion';

export const Toast = ({ toast }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed bottom-8 right-8 p-4 rounded-lg border ${
            toast.className || 'bg-light border-neutral/20'
          } shadow-lg`}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1">
              {toast.title && (
                <h3 className="font-medium text-dark">{toast.title}</h3>
              )}
              {toast.description && (
                <p className="text-sm text-neutral mt-1">{toast.description}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};