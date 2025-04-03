import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { toggleMessage, toggleNotification } from "./slice";
import React from "react";
import { Dispatch } from "redux";

const socketUrl='http://localhost:5000';
export default function startSocket(dispatch:Dispatch){

    const socket=io(socketUrl);
    socket.on('connect',()=>{
        console.log("Socket Connect with id : ",socket.id);
    })


    socket.on('notification',(data)=>{
        console.log("Data ",data);
        
        if(data.type=='normal'){
            dispatch(toggleNotification());
        }else{
            dispatch(toggleMessage());
        }
    })



    return socket;
}