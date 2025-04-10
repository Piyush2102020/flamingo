import { useEffect, useState } from "react"
import './style.css'
import axiosInstance from "../../../helpers/axiosModified"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUsersInInbox, updateChatboxMeta} from "../../../helpers/slice";
import { RootState } from "../../../helpers/store";
import { GenericHeader } from "../../../newComponents/Generics/GenericHeader/file";

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

      {inbox.map((value:any,index)=>{
        return(
          <GenericHeader
          key={index}
          classname="chip"
          decorate={false}
          imagePath={value.userData.profilePicture}
          headText={value.userData.username}
          hintText="Kaise hai bhai?"
          onClick={()=>{
            dispatch(updateChatboxMeta({
              receiverId:value.userId,
              receiverUsername:value.userData.username,
              receiverProfilePicture:value.userData.profilePicture,
              chatboxId:value.chatboxId
            }));
            navigate('/dashboard/chatbox');
    
           }}
           showIcon={false}
           clickType="header"
          >
          
          </GenericHeader>
        )
      })}

    </div>
  )
}