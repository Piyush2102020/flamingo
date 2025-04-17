import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../helpers/store"
import { useEffect, useRef, useState } from "react";
import { getSocket } from "../../helpers/socketServer";
import axiosInstance from "../../helpers/axiosModified";
import { updateChatboxMeta } from "../../helpers/slice";
import { ReceiverMessageLayout, SenderMessageLayout } from "../../newComponents/Clickables/messages/file";
import { BasicInputField } from "../../newComponents/Clickables/fields/file";
import { AccentButton, BasicButton } from "../../newComponents/Clickables/buttons/file";
import { Holder } from "../../newComponents/Generics/GenericHolders/file";
import { GenericHeader } from "../../newComponents/Generics/GenericHeader/file";
import { SmallImage } from "../../newComponents/Clickables/icons/file";
export default function RealtimeChatBox() {
  const context = useSelector((state: RootState) => state.context);

  const [messages, setMessages] = useState<[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const socket = getSocket();
  const dispatch = useDispatch();
  const messageDiv = useRef<HTMLDivElement | null>(null)
  const loadMessage = async () => {
    const oldMessages = await axiosInstance.get(`/getmessages/${context.chatbox.chatboxId}`);
    setMessages(prev => [...prev, ...oldMessages]);
  }

  const scrollToBottom = () => {
    if (messageDiv.current) {
      messageDiv.current.scrollIntoView({ behavior: "smooth" });
    }
  }


  useEffect(() => {
    scrollToBottom();
  }, [messages])

  const sendMessage = () => {
    socket.emit("message", {
      senderId: context.userData._id,
      receiverId: context.chatbox.receiverId,
      text: inputMessage,
      chatboxId: context.chatbox.chatboxId
    });
    setInputMessage("")
  }

  useEffect(() => {
    if (context.chatbox.chatboxId) {
      loadMessage();
    }
    if (socket) {
      socket.on('newMessage', (data: any) => {
        if (!context.chatbox.chatboxId) {
          console.log("Setting chatbox id : ", data.chatboxId);
          dispatch(updateChatboxMeta({ chatboxId: data.chatboxId }));
        }
        if (data.chatboxId == context.chatbox.chatboxId) {
          setMessages(prev => [...prev, data.data]);
        }
      })
    }

    return () => {
      socket?.off('newMessage')
    }
  }, [socket, context.chatbox.chatboxId])


  return (<div  className="chatbox-container">

    
    <Holder style={{padding:"var(--padding-medium)"}} direction="horizontal">
      <SmallImage imgPath={context.chatbox.receiverProfilePicture}/>
      <h1 style={{fontSize:"1.5rem"}}>{context.chatbox.receiverUsername}</h1>
    </Holder>

    <div id="message-container" className="messages">
      {messages ? messages.map((value: any, index) => {

        value.isSender = value.senderId === context.userData._id;
        value.receiverProfilePicture = value.isSender ? context.userData.profilePicture : context.chatbox.receiverProfilePicture;

        return value.isSender ? <SenderMessageLayout key={index} item={value} /> : <ReceiverMessageLayout key={index} item={value} />
      }) : "Start a conversation now"}
      <div ref={messageDiv}></div>
    </div>

    <Holder  style={{backgroundColor:"var(--color-shadow)",gap:"var(--gap-medium)", width: "95%",padding:"var(--padding-medium)",borderRadius:"var(--radius-medium)",alignSelf:"center", alignItems: "center", justifyContent: "center" }} classname="input-field-container" direction="horizontal">
      <textarea value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}  className='input' placeholder='Write Something...' />

      <AccentButton style={{ width: "fit-content" }} onClick={sendMessage} text="Send Message" />
    </Holder>


  </div>)
}