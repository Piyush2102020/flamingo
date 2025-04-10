import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../helpers/store"
import { useEffect, useState } from "react";
import './style.css'
import { getSocket } from "../../helpers/socketServer";
import axiosInstance from "../../helpers/axiosModified";
import { updateChatboxMeta } from "../../helpers/slice";
import { ReceiverMessageLayout, SenderMessageLayout } from "../../newComponents/Clickables/messages/file";
export default function RealtimeChatBox() {
  const chatboxInfo=useSelector((state:RootState)=>state.context.chatbox);
  const senderId=useSelector((state:RootState)=>state.context.userData) as any;
  
  const [messages,setMessages]=useState<[]>([]);
  const [inputMessage,setInputMessage]=useState("");
  const socket=getSocket();
  const dispatch=useDispatch();

  const loadMessage=async ()=>{
    console.log("chatbox id : ",chatboxInfo.chatboxId);
    
    const oldMessages=await axiosInstance.get(`/getmessages/${chatboxInfo.chatboxId}`);
    console.log("Old Messages", oldMessages);
    setMessages(prev=>[...prev,...oldMessages]);
  }

  
  const sendMessage=()=>{
    console.log("Sender Id : ",senderId._id);
    
    socket.emit("message",{
      senderId:senderId._id,
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
          if(!chatboxInfo.chatboxId){
            console.log("Setting chatbox id : ",data.chatboxId);
             dispatch(updateChatboxMeta({chatboxId:data.chatboxId}));
          }
          if(data.chatboxId==chatboxInfo.chatboxId){
            setMessages(prev => [...prev, data.data]);
          }
        })
      }

      return ()=>{
        socket?.off('newMessage')}
    },[socket,chatboxInfo])
    return (<div className="chatbox-container">

      <h2>{chatboxInfo.receiverUsername}</h2>

      <div className="messages">
        {messages?messages.map((value:any,index)=>{
          value.isSender=value.senderId===senderId._id;
          value.receiverProfilePicture=value.isSender?senderId.profilePicture:chatboxInfo.receiverProfilePicture;
          
          console.log("New value : ",value);
          return value.isSender?<SenderMessageLayout key={index} item={value}/>:<ReceiverMessageLayout key={index} item={value}/>}):"Start a conversation now"}
      </div>

      <div className="input-field-container">
        <input value={inputMessage} onChange={(e)=>setInputMessage(e.target.value)} placeholder="write a message" className="input"/>
        <button onClick={sendMessage} className="btn accent">Send Message</button>
      </div>
      </div>)
}