import { useSelector } from "react-redux"
import { RootState } from "../../helpers/store"
import { useState } from "react";
import './style.css'
export default function RealtimeChatBox() {
  const chatboxInfo=useSelector((state:RootState)=>state.context.chatbox);
  
  const [message,setMessage]=useState<[]|null>(null);
    return (<div className="chatbox-container">

      <h2>{chatboxInfo.receiverUsername}</h2>

      <div className="messages">
        {message?"inbox message":"Start a conversation now"}
      </div>

      <div className="input-field-container">
        <input placeholder="write a message" className="input"/>
        <button className="btn accent">Send Message</button>
      </div>
      </div>)
}