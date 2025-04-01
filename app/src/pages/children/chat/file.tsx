import { useEffect, useState } from "react"
import './style.css'
import axiosInstance from "../../../helpers/axiosModified"
import GenericHeader from "../../../components/GenericHeader/file";

export default function Chat(){
    const [chats,setChats]=useState<any[]>([]);
    const fetchChats=async()=>{
        
        const allChats=await axiosInstance.get('/chatbox') as any;
        console.log("items",allChats.chatBoxItems);
        setChats(allChats.chatBoxItems)
    }
    useEffect(()=>{
        fetchChats();
    },[])
    
    return(
        <div className="chatbox">
            <h1>Direct Messages</h1>
            {chats.map((value, index) => (
  <GenericHeader
    key={index}
    clickMode="header"
    profilePic={value.userData.profilePic}
    content="Last Message"
    timestamp=""
    username={value.userData.username}
    redirectUrl={`/dashboard/chatbox?c=${value.userData.username}-${value.userData._id}-${value._id}`}
    style={{
      background: "var(--color-element)",
      padding: "var(--padding-medium)",
      borderRadius: "var(--radius-large)",

    }}
  />
))}

        </div>
    )
}