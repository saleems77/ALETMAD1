//lib/fonts
import { Cairo } from 'next/font/google';

export const cairo = Cairo({ 
  subsets: ['latin', 'arabic'], 
  weight: ['300', '400', '600', '700'], 
  display: 'swap',
  variable: '--font-cairo'
});