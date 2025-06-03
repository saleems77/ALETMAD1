"use client"
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export const Dialog = ({ 
  open, 
  onOpenChange, 
  children, 
  overlayClassName = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50' 
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={overlayClassName}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export const DialogContent = ({ children, className = 'bg-white rounded-xl p-6 w-full max-w-md shadow-xl' }) => (
  <div className={className}>{children}</div>
)

export const DialogHeader = ({ children, className = 'mb-4' }) => (
  <div className={className}>{children}</div>
)