import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

const socket = io(SOCKET_URL, {
  autoConnect: true, // Don't connect automatically
  reconnection: true,
  reconnectionAttempts: 5, // Limit attempts, NOT Infinity
  reconnectionDelay: 2000,
  reconnectionDelayMax: 10000,
  timeout: 10000,
  transports: ['websocket'],
  randomizationFactor: 0.5, // Add jitter to prevent thundering herd
});

// Only connect when explicitly called
export const connectSocket = () => {
  if (!socket.connected) {
    console.log('🔌 Connecting to socket server:', SOCKET_URL);
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
  
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket connection error:', error.message);
  // Stop reconnecting after max attempts
  if (socket.io.reconnectionAttempts >= 5) {
    console.log('Max reconnection attempts reached, stopping...');
    socket.io.opts.reconnection = false;
  }
});

export default socket;