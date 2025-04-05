import React, { useState } from "react";
import { timeAgo } from "../../helpers/timesAgo";
import axiosInstance from "../../helpers/axiosModified";
import { changeCommentInput, setCommentBoxHint, setParentId } from "../../helpers/slice";
import { useDispatch } from "react-redux";
import './style.css'
interface CommentProps {
  item: {
    userId: string;
    postId: string;
    content: string;
    createdAt: string;
    parentId?: string | null;
    likes: string[];
  };
}


export default function CommentLayout({ item, onClick, isReply = false }: { item: any, onClick: () => void, isReply: boolean }) {




  const dispatch = useDispatch();
  const [replies, setReplies] = useState([]);

  const loadReplies = async () => {
    const response = await axiosInstance.get(`/content/${item.postId}/comments/${item._id}`) as [];
    console.log("Childs : ", response);
    setReplies(response);
  }


  const addReplies = () => {
    loadReplies();
  }

  return (
    <div className={`comment-box-replies-container ${isReply ? 'scale' : ""}`}>
      <div className="comment-box-layout" >

        <img className="dp-small" src={item.userData.profilePicture ? item.userData.profilePicture : "/icons/profile-default.svg"} />
        <div style={{ display: "flex", width: "fit-content", flexDirection: "column", gap: "var(--gap-medium)" }}>

          <span style={{ display: "flex", gap: "var(--gap-medium)", alignItems: "center" }}><strong>{item.userData.username}</strong><p className="text-light">{timeAgo(item.createdAt)}</p></span>
          <p className="comment-content">{item.content}</p>
          <div style={{ display: "flex", gap: "var(--gap-medium)" }}><h1 onClick={onClick} className="text-light">Add Reply</h1>{!isReply && <h1 onClick={addReplies} className="text-light">View Replies</h1>}</div>

        </div>

      </div>
      <div style={{ marginLeft: '70px' }}>
        <div style={{ borderLeft: '1px solid var(--color-text-light)' }}>
          {replies.length > 0 && replies.map((value) => <CommentLayout item={value} onClick={() => {
            dispatch(setCommentBoxHint(`Replying to @${value.userData.username}`));
            dispatch(changeCommentInput(`@${value.userData.username}`));
            dispatch(setParentId(value.parentId));
          }} isReply={true} />)}
        </div>

      </div>
    </div>

  );
}
