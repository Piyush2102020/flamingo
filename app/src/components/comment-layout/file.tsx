import React from "react";
import { timeAgo } from "../../helpers/timesAgo";

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

export default function CommentLayout({ item }: any) {
  return (
    <div className="comment-box-layout" style={{margin:"var(--margin-large)",backgroundColor:"var(--color-element)",borderRadius:"var(--radius-medium)",display:"flex" ,gap:"var(--gap-medium)"}}>
        <img className="dp-small" src={item.userData.profilePicture?item.userData.profilePicture:"/icons/profile-default.svg"}/>
        <div style={{display:"flex",flexDirection:"column", gap:"var(--gap-small)"}}>
            
            <span style={{display:"flex",justifyContent:"center",alignItems:"center", gap:"var(--gap-medium)"}}><strong>{item.userData.username}</strong><p className="text-light">{timeAgo(item.createdAt)}</p></span>
      <p className="comment-content">{item.content}</p>
      
        </div>
       
    </div>
  );
}
