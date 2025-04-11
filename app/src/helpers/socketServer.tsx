import { io } from "socket.io-client";



let socket: any = null;

export default function startSocket(userId: string) {
  if (!userId) return null; 
  socket = io(import.meta.env.VITE_BASE_URL, {
    query: { id: userId }
  });

  return socket;
}

export const getSocket = () => {
  return socket;
};
