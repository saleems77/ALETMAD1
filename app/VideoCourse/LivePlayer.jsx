'use client';
import ReactPlayer from 'react-player';
import { useEffect, useState } from 'react';

const LivePlayer = ({ streamUrl, isLive }) => {
  const [playerState, setPlayerState] = useState({
    playing: false,
    volume: 0.8
  });

  useEffect(() => {
    if (isLive) {
      setPlayerState(prev => ({ ...prev, playing: true }));
    }
  }, [isLive]);

  return (
    <div className="relative bg-black rounded-xl overflow-hidden">
      <ReactPlayer
        url={streamUrl || 'https://youtu.be/dQw4w9WgXcQ'} // مثال
        {...playerState}
        width="100%"
        height="500px"
        controls
        config={{
          youtube: {
            playerVars: { modestbranding: 1 }
          }
        }}
      />

      {isLive && (
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
          LIVE
        </div>
      )}
    </div>
  );
};
export default LivePlayer;