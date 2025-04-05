import { timeAgo } from "../../helpers/timesAgo";

export default function CommentLayout({ item }: { item: any }) {

    


    
    return (
        <div className="comment-box-layout">
            <div className="comment-header">
                <img className="icon" src={item.profilePicture ? item.profilePicture : "/icons/profile-default.svg"} />
                <div>
                    <strong>{item.userData.username}</strong>
                    <p>{timeAgo(item.createdAt)}</p>
                </div>
                <div className="">Add Reply</div>
            </div>
            <p>{item.content}</p>

           
        </div>
    )
}