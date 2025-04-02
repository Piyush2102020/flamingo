import { io } from "socket.io-client";

const socketUrl='http://localhost:5000';
export default function startSocket(){

    const socket=io(socketUrl);
    socket.on('connect',()=>{
        console.log("Socket Connect with id : ",socket.id);
        
    })

    socket.on('message',(message)=>{
        alert(`message : ${message.message}`);
    })


    return socket;
}