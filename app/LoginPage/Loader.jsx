'use client';
import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = '24px', color = '#FFFFFF' }) => {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2
          }}
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%'
          }}
        />
      ))}
    </div>
  );
};

export default Loader;