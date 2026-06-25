import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const isValidLatLng = (pos) => {
  if (!Array.isArray(pos) || pos.length !== 2) {
    return false;
  }

  const [lat, lng] = pos;

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  );
};

const FitBounds = ({
  userLocation,
  providerLocation,
}) => {
  const map = useMap();

  useEffect(() => {
    const points = [];

    if (isValidLatLng(userLocation)) {
      points.push(userLocation);
    }

    if (isValidLatLng(providerLocation)) {
      points.push(providerLocation);
    }

    if (points.length === 2) {
      const bounds = L.latLngBounds(points);

      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 16,
      });
    } else if (points.length === 1) {
      map.setView(points[0], 14);
    }
  }, [map, userLocation, providerLocation]);

  return null;
};

export default FitBounds;