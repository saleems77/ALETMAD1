'use client';
import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useMediaRecorder } from '@/contexts/MediaRecorderContext';

const VoiceWaveform = ({ 
  url,
  onReady,
  width = '100%',
  height = 100,
  waveColor = '#3B82F6',
  progressColor = '#2563EB'
}) => {
  const { isRecording } = useMediaRecorder();
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor,
      progressColor,
      cursorColor: 'transparent',
      height,
      responsive: true,
      normalize: true
    });

    if (url) {
      wavesurfer.current.load(url);
    }

    return () => wavesurfer.current?.destroy();
  }, [url]);

  useEffect(() => {
    if (isRecording) {
      // بدء تسجيل جديد
    } else {
      // إيقاف التسجيل
    }
  }, [isRecording]);

  return (
    <div className="relative" style={{ width, height }}>
      <div ref={waveformRef} className="w-full" />
      {isRecording && (
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span className="text-xs text-red-600 font-medium">REC</span>
        </div>
      )}
    </div>
  );
};

export default VoiceWaveform;