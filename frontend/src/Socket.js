// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://tripsage-backend.onrender.com", {
  autoConnect: false // Connect manually to control lifecycle
});

export default socket;
