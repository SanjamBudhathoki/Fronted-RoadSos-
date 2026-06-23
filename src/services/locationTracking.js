export const startTracking = (
  sosId
) => {

  return navigator
    .geolocation
    .watchPosition(
      (position) => {

        socket.emit(
          "provider-location",
          {
            sosId,

            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude
          }
        );

      },

      console.error,

      {
        enableHighAccuracy:true,
        maximumAge:5000
      }
    );
};