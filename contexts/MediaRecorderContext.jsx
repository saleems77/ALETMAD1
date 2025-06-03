'use client';
import { createContext, useContext, useState, useEffect } from 'react';

// 1. إنشاء السياق مع قيم افتراضية
export const MediaRecorderContext = createContext({
  audioStream: null,
  videoStream: null,
  isRecording: false,
  mediaType: 'audio',
  startRecording: () => {},
  stopRecording: () => {},
  setMediaType: () => {},
});

// 2. المكون الرئيسي للبروفايدر
export const MediaRecorderProvider = ({ children }) => {
  const [audioStream, setAudioStream] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaType, setMediaType] = useState('audio');

  // بدء عملية التسجيل
  const startRecording = async () => {
    try {
      const constraints = mediaType === 'video' 
        ? { video: true, audio: true } 
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (mediaType === 'video') {
        setVideoStream(stream);
      } else {
        setAudioStream(stream);
      }

      setIsRecording(true);
    } catch (error) {
      console.error('فشل في بدء التسجيل:', error);
      setIsRecording(false);
    }
  };

  // إيقاف التسجيل وتنظيف الموارد
  const stopRecording = () => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }

    setIsRecording(false);
  };

  // تنظيف الموارد عند إلغاء التثبيت
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  // 3. قيمة السياق المعروضة
  const contextValue = {
    audioStream,
    videoStream,
    isRecording,
    mediaType,
    startRecording,
    stopRecording,
    setMediaType,
  };

  return (
    <MediaRecorderContext.Provider value={contextValue}>
      {children}
    </MediaRecorderContext.Provider>
  );
};

// 4. الهوك للوصول إلى السياق
export const useMediaRecorder = () => {
  const context = useContext(MediaRecorderContext);
  
  if (!context) {
    throw new Error(
      'يجب استخدام useMediaRecorder داخل MediaRecorderProvider'
    );
  }
  
  return context;
};