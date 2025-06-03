"use client"
import Link from 'next/link';
import { useMarketingPageStore } from './MarketingPageContext';
import { mockPages } from './mockPages';
import { useEffect } from 'react';

export default function PageListDashboard() {
  const { pages, setPages } = useMarketingPageStore();

  // تحميل البيانات الوهمية عند التثبيت
  useEffect(() => {
    setPages(mockPages);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">الصفحات التسويقية</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pages.map((page) => (
          <div key={page.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{page.title}</h3>
            <p>الزيارات: {page.visits}</p>
            <div className="mt-4 flex gap-2">
              <Link href={`/builder/${page.id}`} className="btn btn-primary">
                تعديل
              </Link>
              <button className="btn btn-danger">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}