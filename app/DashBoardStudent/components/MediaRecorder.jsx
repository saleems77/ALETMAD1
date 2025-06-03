'use client';
import { useMediaRecorder } from '@/contexts/MediaRecorderContext';
import MediaTypeToggle from './MediaTypeToggle';
import VoiceWaveform from './VoiceWaveform';
import VideoRecorder from './VideoRecorder';

const MediaRecorder = () => {
  const { 
    mediaType,
    isRecording,
    startRecording,
    stopRecording
  } = useMediaRecorder();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <MediaTypeToggle />
      
      {mediaType === 'audio' ? (
        <VoiceWaveform />
      ) : (
        <VideoRecorder />
      )}
      
      <div className="flex justify-center mt-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-8 py-3 rounded-full text-white ${
            isRecording ? 'bg-red-600' : 'bg-green-600'
          }`}
        >
          {isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل'}
        </button>
      </div>
    </div>
  );
};

export default MediaRecorder;