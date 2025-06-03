import { useMapsLibrary } from "@vis.gl/react-google-maps";

export const useHeatmap = (data) => {
  const visualizationLib = useMapsLibrary("visualization");
  let heatmap = null;

  if (visualizationLib) {
    heatmap = new visualizationLib.HeatmapLayer({
      data: data.map((event) => ({
        location: new google.maps.LatLng(event.position.y, event.position.x),
        weight: event.intensity,
      })),
      dissipating: true,
      radius: 30,
    });
  }

  return { heatmap };
};
