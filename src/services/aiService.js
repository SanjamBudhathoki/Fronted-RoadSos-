import { $port } from "./axios";

export const aiService = {
  analyzeEmergency: async (data) => {
    const response = await $port.post(
      "/ai/analyze-emergency",
      data
    );

    return response.data;
  },

voiceSos: async (data) => {
  console.log("send data backend",data)
    const response = await $port.post(
      "/ai/voice-sos",
      data
    );

    return response.data;
  },

  analyzeImage: async (file) => {
    const formData = new FormData();

    formData.append("image", file);

    const response = await $port.post(
      "/ai/analyze-image",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data"
        }
      }
    );

    return response.data;
  },

  chat: async (message, history = []) => {
  const response = await $port.post("/ai/chat", { message, history });
  return response.data;
}
};