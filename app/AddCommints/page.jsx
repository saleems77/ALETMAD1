'use client'; // إذا كنت تحتاج مكونات تفاعلية
import React from 'react';
import MediaRecorder  from '@/app/DashBoardStudent/components/MediaRecorder';

const Page = () => {
  return (

    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">التعليقات الصوتية</h1>
      <MediaRecorder />
    </div>

  );
};

export default Page;