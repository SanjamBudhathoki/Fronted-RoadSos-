import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// created once, not on every render
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

const providerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/296/296216.png",
  iconSize: [35, 35],
});

const isValidLatLng = (pos) =>
  Array.isArray(pos) &&
  pos.length === 2 &&
  Number.isFinite(pos[0]) &&
  Number.isFinite(pos[1]);

// keeps the map view following both markers as they move
const FitBounds = ({ userLocation, providerLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (isValidLatLng(userLocation) && isValidLatLng(providerLocation)) {
      const bounds = L.latLngBounds([userLocation, providerLocation]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (isValidLatLng(userLocation)) {
      map.setView(userLocation, map.getZoom() || 14);
    }
  }, [map, userLocation, providerLocation]);

  return null;
};

const LiveTrackingMaps = ({ userLocation, providerLocation }) => {
  if (!isValidLatLng(userLocation)) return null;

  const showProvider = isValidLatLng(providerLocation);

  return (
    <MapContainer
      center={userLocation}
      zoom={14}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <FitBounds userLocation={userLocation} providerLocation={providerLocation} />

      <Marker position={userLocation} icon={userIcon}>
        <Popup>User Location</Popup>
      </Marker>

      {showProvider && (
        <>
          <Marker position={providerLocation} icon={providerIcon}>
            <Popup>Provider Location</Popup>
          </Marker>

          <Polyline
            positions={[userLocation, providerLocation]}
            pathOptions={{ color: "#dc2626", weight: 3, dashArray: "6 8" }}
          />
        </>
      )}
    </MapContainer>
  );
};

export default LiveTrackingMaps;