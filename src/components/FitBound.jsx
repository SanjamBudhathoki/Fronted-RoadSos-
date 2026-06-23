import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const FitBound = ({ userLocation, providerLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const points = [];

    if (
      Array.isArray(userLocation) &&
      userLocation.length === 2 &&
      Number.isFinite(userLocation[0]) &&
      Number.isFinite(userLocation[1])
    ) {
      points.push(userLocation);
    }

    if (
      Array.isArray(providerLocation) &&
      providerLocation.length === 2 &&
      Number.isFinite(providerLocation[0]) &&
      Number.isFinite(providerLocation[1])
    ) {
      points.push(providerLocation);
    }

    if (points.length === 2) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } else if (points.length === 1) {
      map.setView(points[0], 14);
    }
  }, [map, userLocation, providerLocation]);

  return null;
};

export default FitBound;