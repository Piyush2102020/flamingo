import  { useState } from "react";
import axiosInstance from "../../helpers/axiosModified";
import { changeCommentInput, setCommentBoxHint, setParentId } from "../../helpers/slice";
import { useDispatch } from "react-redux";
import { Holder } from "../../newComponents/Generics/GenericHolders/file";
import { GenericHeader } from "../../newComponents/Generics/GenericHeader/file";
import { TextHint } from "../../newComponents/Generics/GenericText/file";
import { ConditionalRendererWithoutDefault } from "../../newComponents/Generics/GenericConditionlRender/file";

export default function CommentLayout({ item, onClick, isReply = false }: { item: any, onClick: () => void, isReply: boolean }) {

  const dispatch = useDispatch();
  const [replies, setReplies] = useState([]);

  const loadReplies = async () => {
    const response = await axiosInstance.get(`/content/${item.postId}/comments/${item._id}`) as [];
    setReplies(response);
  }


  const addReplies = () => {
    loadReplies();
  }

  return (


    <Holder
      style={{ padding: "var(--padding-medium)" }}
      direction="vertical">
      <GenericHeader
        style={{ justifyContent: "flex-start" }}
        imagePath={item.userData.profilePicture}
        headText={item.userData.username}
        clickType="text"
        showIcon={false}
        content={item.content}
        timestamp={item.createdAt}
        component={<Holder>
          <Holder direction="horizontal">
            <TextHint onClick={onClick} text="Add Reply" />
            <ConditionalRendererWithoutDefault
              condition={!isReply}
              component={<TextHint onClick={addReplies} text="View Replies" />}
            />

          </Holder>
          <Holder>

            {replies.length > 0 && replies.map((value: any, index) => <CommentLayout key={index} item={value} onClick={() => {
              dispatch(setCommentBoxHint(`Replying to @${value.userData.username}`));
              dispatch(changeCommentInput(`@${value.userData.username}`));
              dispatch(setParentId(value.parentId));
            }} isReply={true} />)}
          </Holder>

        </Holder>}
      ></GenericHeader>


    </Holder>
  );
}
