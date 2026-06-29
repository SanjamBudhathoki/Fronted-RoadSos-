import { $port } from "./axios";

export const emergencyContactsService = {
  getContacts: async () => {
    const response = await $port.get("/user/emergency-contacts");
    return response.data;
  },
  updateContacts: async (contacts) => {
    const response = await $port.put("/user/emergency-contacts", { contacts });
    return response.data;
  },
};