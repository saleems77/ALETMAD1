'use client';
import { useState } from 'react';
import LiveStreamScheduler from './LiveStreamScheduler';
import LivePlayer from './LivePlayer';
import ChatOverlay from './ChatOverlay';

const Vidieocourse = () => {
  const [currentStream, setCurrentStream] = useState(null);
  const [isLive, setIsLive] = useState(false);

  return (
    <div className="p-6 space-y-8">
      {/* جدولة البث */}
      {!isLive && (
        <LiveStreamScheduler 
          onSchedule={(stream) => {
            setCurrentStream(stream);
            setIsLive(true);
          }}
        />
      )}

      {/* واجهة البث المباشر */}
      {isLive && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LivePlayer 
              streamUrl={currentStream?.streamUrl}
              isLive={isLive}
            />
          </div>
          
          <div className="lg:col-span-1">
            <ChatOverlay streamId={currentStream?.id} />
          </div>
        </div>
      )}

      {/* التحكم في البث */}
      {isLive && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsLive(false)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            إنهاء البث
          </button>
        </div>
      )}
    </div>
  );
};
export default Vidieocourse;