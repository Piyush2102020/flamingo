import { useEffect } from "react"
import axiosInstance from "../../../helpers/axiosModified"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUsersInInbox, updateChatboxMeta } from "../../../helpers/slice";
import { RootState } from "../../../helpers/store";
import { GenericHeader } from "../../../newComponents/Generics/GenericHeader/file";
import { Holder } from "../../../newComponents/Generics/GenericHolders/file";
import { ServerRoutes } from "../../../helpers/serverRoutes";

export default function Chat() {

  // ------------------------------ State Variables ------------------------------
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state: RootState) => state.context);
  const inbox = state.inbox;
  const isMobile = state.isMobile;

  // ------------------------------ Helper Functions ------------------------------
  const fetchChats = async () => {
    const allChats = await axiosInstance.get(ServerRoutes.chatRoutes.inbox()) as any;
    console.log(allChats);

    dispatch(addUsersInInbox(allChats));
  }
  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="chatbox">
      <h1>Direct Messages</h1>

      <Holder
        direction="horizontal"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--gap-large)",
          alignItems: "flex-start"
        }}>
        {inbox.map((value: any, index) => {
          return (
            <GenericHeader

              rightText=""
              style={isMobile ? { width: "100%" } : { width: "fit-content" }}
              key={index}
              classname="chip"
              imagePath={value.userData.profilePicture}
              headText={value.userData.username}
              hintText={value?.lastMessage?.text}
              timestamp={value?.lastMessage?.createdAt}
              onClick={() => {
                dispatch(updateChatboxMeta({
                  receiverId: value.userId,
                  receiverUsername: value.userData.username,
                  receiverProfilePicture: value.userData.profilePicture,
                  chatboxId: value.chatboxId
                }));
                navigate('/dashboard/chatbox');

              }}
              showIcon={false}
              clickType="header"
            >

            </GenericHeader>
          )
        })}

      </Holder>


    </div>
  )
}