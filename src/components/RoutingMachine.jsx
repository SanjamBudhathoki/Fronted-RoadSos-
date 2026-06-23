import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const RoutingMachine = ({ providerLocation, userLocation }) => {
  const map = useMap();
  const controlRef = useRef(null);
  const initializedRef = useRef(false);

  // Initialize routing control once
  useEffect(() => {
    if (!map || initializedRef.current) return;
    if (!providerLocation || !userLocation) return;

    const [plat, plng] = providerLocation;
    const [ulat, ulng] = userLocation;

    if (!Number.isFinite(plat) || !Number.isFinite(ulat)) return;

    controlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(plat, plng),
        L.latLng(ulat, ulng),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: true,
      lineOptions: {
        styles: [{ color: "#dc2626", weight: 5, opacity: 0.8 }],
      },
      createMarker: () => null, // Don't create default markers
    }).addTo(map);

    initializedRef.current = true;

    return () => {
      if (controlRef.current && map) {
        try {
          map.removeControl(controlRef.current);
        } catch (e) {
          console.warn("Error removing routing control:", e);
        }
        controlRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [map, providerLocation, userLocation]);

  // Update waypoints when locations change
  useEffect(() => {
    if (!controlRef.current || !providerLocation || !userLocation) return;

    const [plat, plng] = providerLocation;
    const [ulat, ulng] = userLocation;

    if (!Number.isFinite(plat) || !Number.isFinite(ulat)) return;

    try {
      controlRef.current.setWaypoints([
        L.latLng(plat, plng),
        L.latLng(ulat, ulng),
      ]);
    } catch (e) {
      console.warn("Error updating waypoints:", e);
    }
  }, [providerLocation, userLocation]);

  return null;
};

export default RoutingMachine;