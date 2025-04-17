import { Dispatch } from "redux";
import { io } from "socket.io-client";
import { toggleNotification } from "./slice";




let socket: any = null;

export default function startSocket(userId: string,dispatch:Dispatch) {
  console.log("Socket url : ",import.meta.env.VITE_BASE_URL);
  
  if (!userId) return null; 
  socket = io(import.meta.env.VITE_BASE_URL, {
    query: { id: userId }
  });
  socket.on('notification',()=>{
    const audio=document.getElementById('background-audio') as HTMLAudioElement;
    console.log("Audio : ",audio);
    audio?.play()
    dispatch(toggleNotification())
  })
  return socket;
}

export const getSocket = () => {
  return socket;
};
