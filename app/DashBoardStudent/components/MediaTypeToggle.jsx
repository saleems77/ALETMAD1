'use client';
import { useMediaRecorder } from '@/contexts/MediaRecorderContext';

const MediaTypeToggle = () => {
  const { mediaType, setMediaType } = useMediaRecorder();

  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => setMediaType('audio')}
        className={`px-4 py-2 rounded-full ${
          mediaType === 'audio' ? 'bg-blue-600 text-white' : 'bg-gray-100'
        }`}
      >
        🎤 صوت
      </button>
      <button
        onClick={() => setMediaType('video')}
        className={`px-4 py-2 rounded-full ${
          mediaType === 'video' ? 'bg-purple-600 text-white' : 'bg-gray-100'
        }`}
      >
        🎥 فيديو
      </button>
    </div>
  );
};

export default MediaTypeToggle;