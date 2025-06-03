'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function LegalHeader() {
  const pathname = usePathname();
  
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* الشعار */}
          <div className="flex items-center">
            <AcademicCapIcon className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold">منصة التعلم العربية</span>
          </div>
          
          {/* روابط إضافية */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`${pathname === '/' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-500`}
            >
              الصفحة الرئيسية
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-500"
            >
              اتصل بنا
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}