'use client';

import Header from './Header';
import Sidebar from './Sidbar';
import { Providers } from '@/app/providers';

export default function DashboardLayout({ children }) {
  return (
    <div className="max-h-screen bg-gray-50">
      <Header />
      
      <div className="flex pt-16">
        <Sidebar />
        
        {/* الجزء الذي سيتغير مع كل صفحة */}
        <main className="flex-1 mr-10 p-2">
          <div className="max-w-full mx-auto">
          <Providers>
            {children}
            </Providers>
          </div>
        </main>
      </div>
    </div>
  );
}