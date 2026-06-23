import { useEffect } from "react";
import { useMap } from "react-leaflet";

const FitBounds=({
  userLocation,
  providerLocation,
})=>{
  const map = useMap();

  useEffect(() => {
    if (!providerLocation) return;

    map.fitBounds([
      userLocation,
      providerLocation,
    ]);
  }, [
    map,
    userLocation,
    providerLocation,
  ]);

  return null;
}

export default FitBounds;