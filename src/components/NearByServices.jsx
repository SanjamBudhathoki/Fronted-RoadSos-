import React, { useEffect, useState, useCallback } from "react";
import { Hospital, Shield, Siren, Wrench, MapPin, Phone, Navigation, Loader2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import Button from "./Button";
import Card from "./Card";
import { nearbyService } from "../services/nearByServices";

const TABS = [
  { type: "hospital", label: "Hospitals", icon: Hospital, color: "text-red-500" },
  { type: "police", label: "Police", icon: Shield, color: "text-blue-400" },
  { type: "ambulance", label: "Ambulance", icon: Siren, color: "text-orange-400" },
  { type: "rescue", label: "Vehicle Rescue", icon: Wrench, color: "text-yellow-400" },
];

const RADIUS_OPTIONS = [2000, 5000, 10000];

const NearbyServices = ({ latitude: propLat, longitude: propLon }) => {
  const [activeTab, setActiveTab] = useState("hospital");
  const [radius, setRadius] = useState(5000);
  const [coords, setCoords] = useState(
    propLat && propLon ? { latitude: propLat, longitude: propLon } : null
  );
  const [locationError, setLocationError] = useState(null);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Your browser doesn't support location access.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationError(null);
      },
      () => setLocationError("Location access denied. Enable it to find nearby help."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    if (!coords) requestLocation();
  }, [coords, requestLocation]);

  useEffect(() => {
    if (!coords) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    nearbyService
      .getNearby(activeTab, coords, radius)
      .then((res) => {
        if (cancelled) return;
        setResults((prev) => ({ ...prev, [activeTab]: res.data || [] }));
        if (res.success === false) {
          toast.error(res.message || "Couldn't load nearby services.");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Something went wrong fetching nearby services.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, coords, radius]);

  const activeResults = results[activeTab] || [];
  const ActiveIcon = TABS.find((t) => t.type === activeTab)?.icon || MapPin;

  return (
    <div className="bg-[#121212] rounded-2xl border border-white/10 p-5 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          Nearby Emergency Services
        </h3>
        <div className="flex gap-1">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                radius === r ? "bg-red-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {r / 1000}km
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {TABS.map(({ type, label, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
              activeTab === type
                ? "bg-linear-to-r from-red-600 to-red-700 text-white shadow-lg"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            <Icon className={`w-4 h-4 ${activeTab === type ? "text-white" : color}`} />
            {label}
          </button>
        ))}
      </div>

      {locationError && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
          <p className="text-gray-400 text-sm">{locationError}</p>
          <Button variant="outline" size="sm" onClick={requestLocation}>
            Enable Location
          </Button>
        </div>
      )}

      {!locationError && loading && (
        <div className="flex items-center justify-center gap-2 py-10 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Finding nearby {TABS.find((t) => t.type === activeTab)?.label.toLowerCase()}...
        </div>
      )}

      {!locationError && error && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <AlertTriangle className="w-7 h-7 text-red-500" />
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      )}

      {!locationError && !loading && !error && activeResults.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <ActiveIcon className="w-8 h-8 text-gray-600" />
          <p className="text-gray-500 text-sm">
            No results within {radius / 1000}km. Try a larger radius above.
          </p>
        </div>
      )}

      {!locationError && !loading && !error && activeResults.length > 0 && (
        <div className="space-y-2.5 max-h-150 overflow-y-auto pr-1">
          {activeResults.map((place) => (
            <Card
              key={place.id}
              className="bg-white/5 hover:bg-white/[0.07] border border-white/10 rounded-xl p-3.5 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{place.name}</p>
                  {place.address && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{place.address}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <span className="flex items-center gap-1 text-red-400 font-medium">
                      <MapPin className="w-3 h-3" /> {place.distanceKm} km
                    </span>
                    {place.openingHours && (
                      <span className="text-gray-500 truncate">{place.openingHours}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {place.phone && (
                    <a href={`tel:${place.phone}`}>
                      <Button variant="success" size="sm" icon={<Phone className="w-3.5 h-3.5" />}>
                        Call
                      </Button>
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" icon={<Navigation className="w-3.5 h-3.5" />}>
                      Directions
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyServices;