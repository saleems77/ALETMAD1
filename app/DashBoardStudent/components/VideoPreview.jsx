'use client';
import { useState, useRef } from 'react';

const VideoPreview = ({ videoUrl, onDelete }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative group bg-black rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-64 object-cover"
        onClick={togglePlayback}
      />
      <button
        onClick={onDelete}
        className="absolute top-2 left-2 p-2 bg-white/80 rounded-full hover:bg-white"
      >
        🗑️
      </button>
      {!isPlaying && (
        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          bg-white/90 p-4 rounded-full shadow-lg"
          onClick={togglePlayback}
        >
          ▶️
        </button>
      )}
    </div>
  );
};

export default VideoPreview;