import { useState, useEffect } from "react";
import "./style.css";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../helpers/axiosModified";
import GenericLoader from "../GenericLoader/file";
import MessageLayout from "../messageLayout/file";

export default function ChatBox() {
    const [params] = useSearchParams();
    const userInfo = params.get("c");

    const [chatBoxId, setChatBoxId] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [receiverId, setReceiverId] = useState("");
    const [username, setUsername] = useState("");
    const [messages,setMessages]=useState([]);



    useEffect(() => {
        if (userInfo) {
            const parts = userInfo.split("-");
            if (parts.length === 3) {
                const [name, userId, chatboxId] = parts;
                setChatBoxId(chatboxId);
                setReceiverId(userId);
                setUsername(name);
                console.log("Chatbox id : ",chatBoxId);
  
            }
        }
    }, [userInfo]); 

  

    const sendMessage = async () => {
        if (!receiverId || !message.trim()) return;
        try {
            const response=await axiosInstance.post("/chat", {
                receiverId:receiverId,
                text: message,
                chatboxId:chatBoxId==''?undefined:chatBoxId,
            }) as any;
            setChatBoxId(response)
            setMessage("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="chatbox-container">
            <h1>{username}</h1>
            <div className="chats">
            {chatBoxId && <GenericLoader url={`/chat?chatboxId=${chatBoxId}`} Element={MessageLayout}  style={{display:"flex",flexDirection:"column-reverse"}}/>}
                
            </div>

            <div className="chat-input-container">
                <input
                className="input"
                    placeholder="Write a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="btn" onClick={sendMessage}>Send Message</button>
            </div>
        </div>
    );
}
