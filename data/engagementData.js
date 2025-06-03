export const processEngagementData = (rawData) => {
  const dailyClicks = rawData.filter(
    (d) => new Date(d.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const scrollData = rawData.filter((d) => d.eventType === "scroll");
  const avgScroll =
    scrollData.length > 0
      ? (
          scrollData.reduce((a, b) => a + b.scrollPosition, 0) /
          scrollData.length
        ).toFixed(1)
      : 0;

  return {
    metrics: { dailyClicks, avgScroll },
    chartData: {
      /* ... */
    },
    heatmapData: {
      /* ... */
    },
  };
};
