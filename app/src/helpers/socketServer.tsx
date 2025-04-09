import { io } from "socket.io-client";

const socketUrl = 'http://localhost:5000';

let socket: any = null;

export default function startSocket(userId: string) {
  if (!userId) return null; 
  socket = io(socketUrl, {
    query: { id: userId }
  });

  return socket;
}

export const getSocket = () => {
  return socket;
};
