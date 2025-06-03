'use client';
import { useParams } from 'next/navigation';
import LicenseManager from '../../components/LicenseManager';

export default function LicensePage() {
  const params = useParams();
  const courseId = params.courseId;

  return (
    <div className="container mx-auto p-4">
      <LicenseManager courseId={courseId} />
    </div>
  );
}