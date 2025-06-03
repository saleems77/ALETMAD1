'use client';
import { useRef, useEffect } from 'react';
import { useMediaRecorder } from '@/contexts/MediaRecorderContext';

const VideoRecorder = () => {
  const { videoStream, isRecording } = useMediaRecorder();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoStream && videoRef.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  return (
    <div className="relative bg-black rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-64 object-cover"
      />
      {isRecording && (
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
          <span className="text-sm text-white font-medium">جارٍ التسجيل...</span>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;