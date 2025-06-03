"use client";
import { useEffect, useState } from 'react';
import { getForumData } from '@/mocks/communityData';
import Link from 'next/link';
import { DataTable } from '@/components/ui/DataTable';

const DiscussionForum = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب البيانات الوهمية
    const fetchData = async () => {
      const data = await getForumData();
      setDiscussions(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">منتدى النقاشات التعليمية [[1]]</h1>
      <DataTable 
        columns={[
          { header: 'عنوان النقاش', accessor: 'title' },
          { header: 'المشاركون', accessor: 'participants' },
          { header: 'آخر تحديث', accessor: 'lastUpdate' }
        ]}
        data={discussions}
        onRowClick={(row) => router.push(`/community/${row.id}`)}
      />
    </div>
  );
};

export default DiscussionForum;