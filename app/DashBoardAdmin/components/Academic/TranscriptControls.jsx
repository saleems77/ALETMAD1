'use client';
import { useRouter } from 'next/navigation';

export default function TranscriptControls({ transcriptId }) {
  const router = useRouter();
  
  return (
    <div className="flex gap-4 mt-6">
      <button 
        onClick={() => router.push(`/academic/transcripts/${transcriptId}/edit`)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        تعديل السجل
      </button>
    </div>
  );
}