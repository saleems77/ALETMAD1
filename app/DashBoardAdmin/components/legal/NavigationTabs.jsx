'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavigationTabs() {
  const pathname = usePathname();
  
  const tabs = [
    { path: './privacy', label: 'الخصوصية' },
    { path: '/legal/terms', label: 'الشروط' }
  ];

  return (
    <div className="flex gap-2 mt-4 md:mt-0">
      {tabs.map(tab => (
        <Link
          key={tab.path}
          href={tab.path}
          className={`px-4 py-2 rounded-lg ${
            pathname === tab.path
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}