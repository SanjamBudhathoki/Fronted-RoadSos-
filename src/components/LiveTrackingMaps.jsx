import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import FitBounds from "./FitBound";
import RoutingMachine from "./RoutingMachine";

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// User icon
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Provider icon
const providerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const isValidLatLng = (pos) => {
  if (!Array.isArray(pos) || pos.length !== 2) return false;

  const [lat, lng] = pos;

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

const LiveTrackingMaps = ({
  userLocation,
  providerLocation,
}) => {
  if (!isValidLatLng(userLocation)) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-600 font-medium">
          Location Unavailable
        </p>
        <p className="text-sm text-red-500 mt-1">
          Unable to determine your location.
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
        style={{
          height: "400px",
          width: "100%",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <FitBounds
          userLocation={userLocation}
          providerLocation={providerLocation}
        />

        <Marker
          position={userLocation}
          icon={userIcon}
        >
          <Popup>
            <strong>Your Location</strong>
          </Popup>
        </Marker>

        {showProvider && (
          <>
            <Marker
              position={providerLocation}
              icon={providerIcon}
            >
              <Popup>
                <strong>Provider</strong>
              </Popup>
            </Marker>

            <RoutingMachine
              providerLocation={providerLocation}
              userLocation={userLocation}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default LiveTrackingMaps;