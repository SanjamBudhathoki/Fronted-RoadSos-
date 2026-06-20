import { $port } from "./axios";


export const authService = {
  login: async (credentials) => {
    const response = await $port.post('/user/login', credentials);
    if (response.data.token) {
      localStorage.setItem('accesstoken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await $port.post('/user/register', userData);
    if (response.data.token) {
      localStorage.setItem('accesstoken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('user');
  },
  getProfile: async () => {
    const response = await $port.get('/user/profile');
    return response.data;
  },
  updateProviderAvailability: async (data) => {
    const response = await $port.put('/user/provider/updateAvailability', data);
    return response.data;
  },
  updateProfile: async (data) => {
  const response = await $port.put("/user/update", data);
  return response.data;
},

deleteProfile: async (id) => {
  const response = await $port.delete(`/user/delete/${id}`);
  return response.data;
},
};
