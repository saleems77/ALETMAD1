export const generateMockComments = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i,
    type: i % 2 === 0 ? "audio" : "video",
    url:
      i % 2 === 0
        ? "https://example.com/audio.mp3"
        : "https://example.com/video.mp4",
    duration: Math.floor(Math.random() * 300) + 30,
    timestamp: new Date().toISOString(),
  }));
};
