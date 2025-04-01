import { useState } from "react";
import { timeAgo } from "../../helpers/timesAgo"; 
import './style.css'
import axiosInstance from "../../helpers/axiosModified";
import { useDispatch } from "react-redux";
import { setCommentBoxID, setParentId, setPostId, toggleCommentBox } from "../../helpers/slice";
import GenericHeader from "../GenericHeader/file";

export default function PostComponent({ item }: { item: any }) {
    let [isLiked, setIsLiked] = useState<Number>(item.isLiked);
    const [likes,setLikes]=useState<any>(item.likesCount);
    const dispatch = useDispatch();

    const Interact = async (type: string) => {
        await axiosInstance.post(`content/${item._id}?type=${type}`);
    }

    const handleClick = () => {

        if (isLiked) {
            Interact('dislike')
            setLikes(value=>value-1>0?value-1:0);
        } else {
            Interact('like')
            setLikes(value=>value+1)
        }
        setIsLiked(!isLiked);
    }
    return (

        <div data-id={item._id} className="post-component">
            <div className="post-header">
            <GenericHeader icons="show" clickMode="username" username={item.userData.username} profilePic={item.userData.profilePic} content="Location Comes Here"
                timestamp={timeAgo(item.createdAt)} redirectUrl={`/dashboard/profile?user=${item.userData.username}-${item.userData._id}`}/>
            </div>
            <div className="post-content">

                {item.media && <img className="post-image" src={item.media} />}
            </div>


            <div className="post-footer">

                <div className="post-footer-icon">


                    <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" fill={isLiked ? "var(--flamingo)" : "none"} viewBox="0 0 24 24" stroke-width="1.5" stroke={isLiked ? "none" : "currentColor"} className="icon">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>

                    <svg onClick={() => {
                        dispatch(setPostId(item._id))
                        dispatch(toggleCommentBox())
                    }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                </div>
                <p className="text-light">{`${likes} likes`}</p>
                <p className="text-normal"><strong className="text-bold">{item.userData.username}  </strong>{item.content}</p>

            </div>
        </div>
    )
}