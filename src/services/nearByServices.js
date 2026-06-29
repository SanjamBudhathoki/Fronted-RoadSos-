import { $port } from "./axios";

const ENDPOINTS = {
  hospital: "/nearby/hospitals",
  police: "/nearby/police",
  ambulance: "/nearby/ambulance",
  rescue: "/nearby/rescue",
};

export const nearbyService = {
  getNearby: async (type, { latitude, longitude }, radius = 5000) => {
  const response = await $port.get(ENDPOINTS[type], { params: { latitude, longitude, radius } });
  return response.data;
},
};