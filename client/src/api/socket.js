import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:8000/api", {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
