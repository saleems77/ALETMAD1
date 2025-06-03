// components/FontWrapper.tsx
'use client';

import { useEffect } from 'react';
import { cairo } from '@/lib/fonts';

export default function FontWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // حل لتجنب مشاكل SSR
    if (typeof document !== 'undefined') {
      if (!document.documentElement.classList.contains(cairo.variable)) {
        document.documentElement.classList.add(cairo.variable);
      }
    }
  }, []);

  return <>{children}</>;
}