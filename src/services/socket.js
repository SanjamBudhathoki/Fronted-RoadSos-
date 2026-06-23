import { io } from "socket.io-client";


const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5642';

console.log('🔌 Connecting to socket server:', SOCKET_URL);

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
});

socket.on('connect', () => {
  console.log(' Socket connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error(' Socket connection error:', error.message);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Socket reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_attempt', (attemptNumber) => {
  console.log('Reconnection attempt:', attemptNumber);
});

socket.on('reconnect_error', (error) => {
  console.error('Reconnection error:', error.message);
});

socket.on('reconnect_failed', () => {
  console.error('Failed to reconnect after all attempts');
});

export default socket;