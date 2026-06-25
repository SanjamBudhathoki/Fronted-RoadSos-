import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const RoutingMachine = ({
  providerLocation,
  userLocation,
}) => {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (
      !providerLocation ||
      !userLocation
    ) {
      return;
    }

    if (routingRef.current) {
      map.removeControl(routingRef.current);
    }

    routingRef.current = L.Routing.control({
      waypoints: [
        L.latLng(
          providerLocation[0],
          providerLocation[1]
        ),
        L.latLng(
          userLocation[0],
          userLocation[1]
        ),
      ],

      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,

      lineOptions: {
        styles: [
          {
            color: "#dc2626",
            opacity: 0.8,
            weight: 6,
          },
        ],
      },

      createMarker: () => null,
    }).addTo(map);

    routingRef.current.on(
      "routesfound",
      (e) => {
        const route = e.routes[0];

        const distance =
          route.summary.totalDistance / 1000;

        const duration =
          route.summary.totalTime / 60;

        console.log(
          "Distance:",
          distance.toFixed(2),
          "km"
        );

        console.log(
          "ETA:",
          Math.round(duration),
          "min"
        );
      }
    );

    return () => {
      if (routingRef.current) {
        map.removeControl(
          routingRef.current
        );
      }
    };
  }, [
    map,
    providerLocation,
    userLocation,
  ]);

  return null;
};

export default RoutingMachine;