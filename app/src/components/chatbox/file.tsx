import { useEffect, useState } from 'react'
import './style.css'
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../helpers/axiosModified';
import GenericLoader from '../GenericLoader/file';
import MessageLayout from '../messageLayout/file';



export default function ChatHandler() {
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [params] = useSearchParams();
    const [message, setMessage] = useState("");
    const [chatBoxId, setChatBoxId] = useState<String | null>(null);

    const [addMessageToLoader, setAddMessageToLoader] = useState<((msg: any) => void) | null>(null);


    const loadChatBoxId = async () => {
        console.log("Searching for chatbox with id :", userId);

        if (userId) {
            const responseChatId = await axiosInstance.get(`/chatboxid?id=${userId}`) as any;
            setChatBoxId(responseChatId);
            console.log("Chatbox Id : ", responseChatId);

        }
    }



    const sendMessage = async () => {
        console.log("Chatbox id : ", chatBoxId);

        const response = await axiosInstance.post(`/chat?id=${chatBoxId}`, { text: message, receiverId: userId }) as any;
        console.log("Response : ", response)
        if (!chatBoxId) {
            setChatBoxId(response);
        }
        const newMessage = { text: message, receiverId: userId, timestamp: new Date().toISOString() };
        if (addMessageToLoader) {
            addMessageToLoader(newMessage);
        }
        setMessage("");

    }
    useEffect(() => {
        if (userId) {
            loadChatBoxId();
        }
    }, [userId])

    useEffect(() => {
        console.log("Params : ", params);

        if (params) {
            const userUrl = params.get('user');
            console.log("user url : ", userUrl);

            if (userUrl) {
                console.log("User data : ", userUrl);
                const ids = userUrl.split("-");
                setUsername(ids[0]);
                setUserId(ids[1]);
            }
        }
    }, [params])

    return (
    
    <div className='chat-container'>
        <h1>{username}</h1>
        <div className='chats'>
            {chatBoxId && <GenericLoader url={`/chat?id=${chatBoxId}`} Element={MessageLayout} />}
        </div>
        <div className='chat-input-container'>
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Write a message' className='input' />
            <button className='btn accent' onClick={sendMessage}>Send Message</button>
        </div>
    </div>)
}