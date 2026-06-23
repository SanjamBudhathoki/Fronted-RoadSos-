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

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// User icon (person in need)
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Provider icon (ambulance/responder)
const providerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const isValidLatLng = (pos) => {
  if (!Array.isArray(pos) || pos.length !== 2) return false;
  const [lat, lng] = pos;
  return (
    Number.isFinite(lat) && 
    Number.isFinite(lng) &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
};

// Auto-fit bounds component
const FitBounds = ({ userLocation, providerLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const points = [];
    
    if (isValidLatLng(userLocation)) {
      points.push(userLocation);
    }
    
    if (isValidLatLng(providerLocation)) {
      points.push(providerLocation);
    }

    if (points.length === 2) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (points.length === 1) {
      map.setView(points[0], 14);
    }
  }, [map, userLocation, providerLocation]);

  return null;
};

const LiveTrackingMaps = ({ userLocation, providerLocation }) => {
  // Debug logging
  console.log("🗺️ Map Rendering:", {
    userLocation,
    providerLocation,
    userValid: isValidLatLng(userLocation),
    providerValid: isValidLatLng(providerLocation),
  });

  if (!isValidLatLng(userLocation)) {
    console.warn("⚠️ Invalid user location:", userLocation);
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-600 font-medium">Location Unavailable</p>
        <p className="text-sm text-red-500 mt-1">
          Unable to determine your location. Please enable GPS.
        </p>
      </div>
    );
  }

  const showProvider = isValidLatLng(providerLocation);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
      <MapContainer
        center={userLocation}
        zoom={14}
        style={{ height: "400px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <FitBounds 
          userLocation={userLocation} 
          providerLocation={providerLocation} 
        />

        {/* User Marker */}
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold text-red-600">📍 Your Location</p>
              <p className="text-xs text-gray-500 mt-1">
                {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Provider Marker */}
        {showProvider && (
          <>
            <Marker position={providerLocation} icon={providerIcon}>
              <Popup>
                <div className="text-center">
                  <p className="font-semibold text-green-600">🚑 Provider</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {providerLocation[0].toFixed(4)}, {providerLocation[1].toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Route Line */}
            <Polyline
              positions={[userLocation, providerLocation]}
              pathOptions={{
                color: "#dc2626",
                weight: 4,
                opacity: 0.7,
                dashArray: "10 8",
              }}
            />
          </>
        )}

        {/* Show message if provider not available */}
        {!showProvider && (
          <div className="leaflet-top leaflet-right">
            <div className="leaflet-control bg-white p-3 rounded-lg shadow-lg m-2">
              <p className="text-sm text-gray-600">
                ⏳ Waiting for provider location...
              </p>
            </div>
          </div>
        )}
      </MapContainer>
    </div>
  );
};

export default LiveTrackingMaps;