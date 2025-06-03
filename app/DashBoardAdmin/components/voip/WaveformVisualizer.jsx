// WaveformVisualizer.jsx
"use client"
import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js'; // تثبيت: npm install wavesurfer.js

const WaveformVisualizer = ({ audioUrl }) => {
  const waveformRef = useRef(null);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4C9AFF',
      progressColor: '#2B6CB0',
      url: audioUrl,
    });
    return () => wavesurfer.destroy();
  }, [audioUrl]);

  return <div ref={waveformRef} className="waveform-container h-24" />;
};

export default WaveformVisualizer;