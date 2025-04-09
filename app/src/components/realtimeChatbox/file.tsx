import { useSelector } from "react-redux"
import { RootState } from "../../helpers/store"
import { useEffect, useState } from "react";
import './style.css'
import { getSocket } from "../../helpers/socketServer";
import axiosInstance from "../../helpers/axiosModified";
export default function RealtimeChatBox() {
  const chatboxInfo=useSelector((state:RootState)=>state.context.chatbox);
  const senderId=useSelector((state:RootState)=>state.context.userData._id);
  
  const [messages,setMessages]=useState([]);
  const [inputMessage,setInputMessage]=useState("");
  const socket=getSocket();


  const loadMessage=async ()=>{
    const oldMessages=await axiosInstance.get(`/getmessages/${chatboxInfo.chatboxId}`);
    console.log("Old Messages", oldMessages);
    setMessages(prev=>[...prev,...oldMessages]);
  }

  
  const sendMessage=()=>{
    
    socket.emit("message",{
      senderId:senderId,
      receiverId:chatboxInfo.receiverId,
      text:inputMessage,
      chatboxId:chatboxInfo.chatboxId
    });

    }

    useEffect(()=>{
      if(chatboxInfo.chatboxId){
       loadMessage(); 
      }
      if(socket){
        socket.on('newMessage',(data:any)=>{
          console.log(data);
          
          if(data.chatboxId==chatboxInfo.chatboxId){
            setMessages(prev => [...prev, data.data]);
          }
        })
      }

      return ()=>{
        socket?.off('newMessage')}
    },[socket])
    return (<div className="chatbox-container">

      <h2>{chatboxInfo.receiverUsername}</h2>

      <div className="messages">
        {messages?messages.map((value)=><h4>{value.text}</h4>):"Start a conversation now"}
      </div>

      <div className="input-field-container">
        <input value={inputMessage} onChange={(e)=>setInputMessage(e.target.value)} placeholder="write a message" className="input"/>
        <button onClick={sendMessage} className="btn accent">Send Message</button>
      </div>
      </div>)
}