// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Providers as OtherProviders } from './providers';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = { 
  title: 'منصة الإعتماد العربي', 
  description: 'منصة متخصصة في الاعتماد التعليمي' 
};

// حل بديل: إضافة تأكيد على وجود قيمة للخط

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
    
  
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50">
        <OtherProviders>
          <ClientLayout>{children}</ClientLayout>
        </OtherProviders>
      </body>
    </html>
  );
}