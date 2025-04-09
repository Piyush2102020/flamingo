import { useEffect, useState } from "react"
import './style.css'
import axiosInstance from "../../../helpers/axiosModified"
import GenericHeader from "../../../components/GenericHeader/file";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUsersInInbox, updateChatboxMeta} from "../../../helpers/slice";
import { RootState } from "../../../helpers/store";

export default function Chat() {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const inbox=useSelector((state:RootState)=>state.context.inbox);

  const fetchChats = async () => {
    const allChats = await axiosInstance.get('/inbox') as any;
    dispatch(addUsersInInbox(allChats));
  }
  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="chatbox">
      <h1>Direct Messages</h1>
      {inbox.map((value, index) =><h2><GenericHeader 
      key={index}
      clickMode="header"
       profilePic={value.userData.profilePicture}
       username={value.userData.username}
       onClick={()=>{
        dispatch(updateChatboxMeta({
          receiverId:value.userId,
          receiverUsername:value.userData.username,
          receiverProfilePicture:value.userData.profilePicture,
          chatboxId:value.chatboxId
        }));
        navigate('/dashboard/chatbox');

       }}
       content=""
       timestamp=""
      /></h2>
      )}

    </div>
  )
}