import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const RoutingMachine = ({ providerLocation, userLocation }) => {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (!providerLocation || !userLocation) return;

    if (!controlRef.current) {
      controlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(providerLocation[0], providerLocation[1]),
          L.latLng(userLocation[0], userLocation[1]),
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: false,
      }).addTo(map);
    } else {
      // update waypoints in place instead of tearing down the control
      controlRef.current.setWaypoints([
        L.latLng(providerLocation[0], providerLocation[1]),
        L.latLng(userLocation[0], userLocation[1]),
      ]);
    }

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
    };
  }, [map]); // intentionally not re-running on every location tick — see below

  // separate effect just for updating waypoints on location change
  useEffect(() => {
    if (controlRef.current && providerLocation && userLocation) {
      controlRef.current.setWaypoints([
        L.latLng(providerLocation[0], providerLocation[1]),
        L.latLng(userLocation[0], userLocation[1]),
      ]);
    }
  }, [providerLocation, userLocation]);

  return null;
};

export default RoutingMachine;