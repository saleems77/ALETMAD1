'use client';
import { Suspense } from 'react';
import AddTestComponent from '@/components/AddTestPage';

export default function AddTest() {
  return (
    <Suspense fallback={<div className="text-center py-10">جارٍ التحميل...</div>}>
      <AddTestComponent />
    </Suspense>
  );
}