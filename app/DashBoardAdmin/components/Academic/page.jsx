"use client"
import { useAcademic } from './useAcademic';
import TranscriptBuilder from './TranscriptBuilder';
import LoadingSpinner from './LoadingSpinner';

export default function AcademicDashboard() {
  const { loading } = useAcademic();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">الإدارة الأكاديمية</h1>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">إنشاء سجلات جديدة</h2>
        <TranscriptBuilder />
      </section>

    
    </div>
  );
}