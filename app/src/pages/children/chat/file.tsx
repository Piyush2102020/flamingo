import { useEffect, useState } from "react"
import './style.css'
import axiosInstance from "../../../helpers/axiosModified"
import GenericHeader from "../../../components/GenericHeader/file";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateChatboxMeta } from "../../../helpers/slice";

export default function Chat() {
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const [chats, setChats] = useState<any[]>([]);
  const fetchChats = async () => {

    const allChats = await axiosInstance.get('/chatbox') as any;
    console.log("items", allChats.chats);
    setChats(allChats.chats)
  }
  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="chatbox">
      <h1>Direct Messages</h1>
      {chats.map((value, index) => (
        <GenericHeader
          key={index}
          clickMode="header"
          profilePic={value.profilePic}
          content="Last Message"
          timestamp=""
          username={value.username}
          onClick={() => {
            const object={
              receiverUsername:value.username,
              receiverId:value._id,
              receiverDp:value.profilePicture,
              messages:[]
            };
            console.log("On click called setting values",object);
            dispatch(updateChatboxMeta(object));
            navigate('/dashboard/chatbox');

          }}
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