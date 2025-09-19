// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "https://tripsage-backend.onrender.com";

// Create only one socket connection
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
