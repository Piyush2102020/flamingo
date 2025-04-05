import { io } from "socket.io-client";
import { addMessage, toggleMessage, toggleNotification } from "./slice";
import { Dispatch } from "redux";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { useEffect } from "react";

const socketUrl = 'http://192.168.1.7:5000';
const socket=io(socketUrl);
export default function startSocket(dispatch:Dispatch){
    const userData=useSelector((state:RootState)=>state.context.userData._id);
    
    socket.on('connect',()=>{
        console.log("Socket Connect with id : ",socket.id);
    })
    

    socket.on('notification',(data)=>{

        if(data.type=='normal'){
            dispatch(toggleNotification());
        }else{
            dispatch(toggleMessage());
        }
    });

    useEffect(()=>{
        if(userData){
            socket.emit('register',userData)
        }
    },[userData]);

    return socket;
}

export const getSocket=()=>{
    return socket;
}