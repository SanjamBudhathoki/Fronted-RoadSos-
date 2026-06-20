import { io } from "socket.io-client";

const socket = io(import.meta.env.API_BASE_URL || "http://localhost:5642", {
  withCredentials: true
});

export default socket;