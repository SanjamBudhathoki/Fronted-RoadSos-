import { $port } from "./axios";
import { saveOfflineSOS } from "./offlineSOS";

export const sosService = {
  createSos: async (data) => {
  try {
    const payload = {
      emergencyType: data.emergencyType,
      coordinates: data.coordinates,
      notes: data.notes || "",
      imageUrl: data.imageUrl || null,
      imagePublicId: data.imagePublicId || null,
      aiAnalysisResult: data.aiAnalysisResult || null,
    };

    const response = await $port.post('/sos/create', payload);
    return response.data;
  } catch (error) {
    // Fallback to offline storage
    saveOfflineSOS({
      ...data,
      createdAt: Date.now()
    });
    throw error;
  }
},
  getMySos: async () => {
    const response = await $port.get('/sos/my');
    return response.data;
  },
 getNearbySos: ({ longitude, latitude }) => {
  return $port.get(
    `/sos/provider/nearby?longitude=${longitude}&latitude=${latitude}`
  );
},
  getSingleSos: async (id) => {
    const response = await $port.get(`/sos/${id}`);
    return response.data;
  },
  acceptSos: async (id) => {
    const response = await $port.put(`/sos/${id}/accept`);
    return response.data;
  },
  updateSosStatus: async (id, status) => {
    const response = await $port.put(`/sos/${id}/status`, { status });
    return response.data;
  },
  getActiveMission: async () => {
  const response = await $port.get('/sos/provider/active');
  return response.data;
},
cancelSos: async (id) => {
  const response = await $port.delete(`/sos/delete/${id}`);
  return response.data;
},
};
