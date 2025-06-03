"use client"
import { motion } from 'framer-motion'

export const Skeleton = ({ className, ...props }) => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className={`animate-pulse bg-gray-200 rounded-md ${className}`}
    {...props}
  />
)