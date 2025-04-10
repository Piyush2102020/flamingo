import { useState } from "react";
import { timeAgo } from "../../helpers/timesAgo";
import './style.css'
import axiosInstance from "../../helpers/axiosModified";
import { useDispatch } from "react-redux";
import { addComments, setCommentBoxID, setParentId, setPostId, toggleCommentBox } from "../../helpers/slice";
import { GenericHeader } from "../../newComponents/Generics/GenericHeader/file";
import { useNavigate } from "react-router-dom";

export default function PostComponent({ item }: { item: any }) {
    let [isLiked, setIsLiked] = useState<Number>(item.isLiked);
    const [likes, setLikes] = useState<any>(item.likesCount);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const Interact = async (type: string) => {
        await axiosInstance.post(`content/${item._id}?type=${type}`);
    }

    const handleClick = () => {

        if (isLiked) {
            Interact('dislike')
            setLikes(value => value - 1 > 0 ? value - 1 : 0);
        } else {
            Interact('like')
            setLikes(value => value + 1)
        }
        setIsLiked(!isLiked);
    }
    return (

        <div data-id={item._id} className="post-component">

                <GenericHeader
                    clickType="text"
                    headText={item.userData.username}
                    timestamp={item.createdAt}
                    hintText="Location Comes Here"
                    onClick={() => { navigate(`/dashboard/profile?user=${item.userData.username}-${item.userData._id}`) }}
                    imagePath={item.userData.profilePicture}
                />

                {item.media && <img className="post-image" src={item.media} />}



            <div className="post-footer">

                <div className="post-footer-icon">
                    <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" fill={isLiked ? "var(--flamingo)" : "none"} viewBox="0 0 24 24" stroke-width="1.5" stroke={isLiked ? "none" : "currentColor"} className="icon">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>

                    <svg onClick={() => {
                        dispatch(setPostId(item._id));
                        dispatch(addComments([]));
                        dispatch(toggleCommentBox())
                    }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M80 134.87 170.26 214a8 8 0 0 0 13.09-4.21L224 33.22a1 1 0 0 0-1.34-1.15L20 111.38a6.23 6.23 0 0 0 1 11.92Zm44.37 38.91-30.61 31.76A8 8 0 0 1 80 200v-65.13" />
                    </svg>
                </div>
                <p className="text-light">{`${likes} likes`}</p>
                <p className="text-normal"><strong className="text-bold">{item.userData.username}  </strong>{item.content}</p>

            </div>
        </div>
    )
}