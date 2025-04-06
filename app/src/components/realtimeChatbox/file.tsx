import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../helpers/store"
import { useEffect, useState } from "react";
import { addMessage, updateChatboxMeta } from "../../helpers/slice";
import { getSocket } from "../../helpers/socketServer";
import axiosInstance from "../../helpers/axiosModified";
import { toast } from "react-toastify";

export default function RealtimeChatBox() {
    const chatBoxContext = useSelector((state: RootState) => state.context.chatbox);
    const currentUser=useSelector((state:RootState)=>state.context.userData);
    const dispatch=useDispatch();
    const [message,setMessage]=useState("");
    const socket=getSocket();


    const loadChat=async()=>{
        const response=await axiosInstance.get(`/loadchat?id=${chatBoxContext.chatboxId}`);
        dispatch(addMessage(response));
    }

    useEffect(()=>{
        console.log("Loading older messages");
        console.log("Chatbox Id : ",chatBoxContext.chatboxId);
        loadChat();
    },[chatBoxContext.chatboxId]);




    useEffect(()=>{
        if(!chatBoxContext.chatboxId){
          axiosInstance.get(`/chatboxid?id=${chatBoxContext.receiverId}`).then((data)=>{
            console.log("old id",data);
            dispatch(updateChatboxMeta({chatboxId:data}));
          }).catch(e=>toast.error(e));
          
        }
    },[])

    useEffect(() => {
        const handler = (data: any) => {

            if (chatBoxContext.chatboxId === data.id) {
                dispatch(addMessage([data.message]));
            } 
            
            else if (
                !chatBoxContext.chatboxId &&
                (chatBoxContext.receiverId === data.receiverId || chatBoxContext.receiverId === currentUser._id)
            ) {
                dispatch(updateChatboxMeta({ chatboxId }));
                dispatch(addMessage([data.message]));
            } 
            
            // Message for another chatbox not currently open
            else {
                console.log("New message received for another chatbox:", data.id);
                // Optionally show a toast or increment unread counter
            }
        };
    
        socket.on('newMessage', handler);
    
        return () => {
            socket.off('newMessage', handler);
        };
    }, [socket, chatBoxContext.chatboxId, chatBoxContext.receiverId, dispatch]);
    
    
       
      

    const sendMessage=()=>{   
        if(socket){
            socket.emit('message',{chatboxId:chatBoxContext.chatboxId,senderId:currentUser._id,receiverId:chatBoxContext.receiverId,message:message});   
        }
    }

    return (<div className="chatbox-container">

        <h1>{chatBoxContext.receiverUsername}</h1>

        <div className="all-chats">
            {chatBoxContext.messages.length > 0 ?
                chatBoxContext.messages.map((value: any) => <h1>{value.text}</h1>)
                : <p>Start a chat now</p>}
        </div>
        <div>
            <input onChange={(e)=>setMessage(e.target.value)} value={message} className="input" placeholder="write a message" />
            <button onClick={sendMessage} className="btn accent">Send Message</button>    </div>
    </div>)
}