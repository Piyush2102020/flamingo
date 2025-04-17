import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../helpers/axiosModified";
import { useDispatch, useSelector } from "react-redux";
import { addComments, setPostId, toggleCommentBox } from "../../helpers/slice";
import { GenericHeader } from "../../newComponents/Generics/GenericHeader/file";
import { useNavigate } from "react-router-dom";
import { Holder } from "../../newComponents/Generics/GenericHolders/file";
import { SmallIcon } from "../../newComponents/Clickables/icons/file";
import { TextHint } from "../../newComponents/Generics/GenericText/file";
import { ConditionalRendererWithDefault, ConditionalRendererWithoutDefault } from "../../newComponents/Generics/GenericConditionlRender/file";
import { ShowOptions } from "../pnf/pleaseWait";
import { RootState } from "../../helpers/store";

export default function PostComponent({ item }: { item: any }) {
    const userData=useSelector((state:RootState)=>state.context.userData)
    let [isLiked, setIsLiked] = useState<boolean>(item.isLiked);
    const [likes, setLikes] = useState<number>(item.likesCount);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [options,showOptions]=useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const Interact = async (type: string) => {
        console.log("Making request : ", `content/${item._id}/interact?type=${type}`);

        await axiosInstance.post(`content/${item._id}/interact?type=${type}`);
    };

    const handleClick = () => {
        if (isLiked) {
            Interact('dislike');
            setLikes((value) => (value - 1 > 0 ? value - 1 : 0));
        } else {
            Interact('like');
            setLikes((value) => value + 1);
        }
        setIsLiked(!isLiked);
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(video);

        return () => {
            observer.unobserve(video);
        };
    }, [videoRef]);

    const toggleMute = () => {
        setIsMuted((prev) => !prev);
    };

    return (
        <div data-id={item._id} style={{ padding: "var(--padding-medium)" }} className="post-component">
            <GenericHeader
            iconClick={()=>{showOptions(!options)}}
                clickType="text"
                headText={item.userData.username}
                timestamp={item.createdAt}
                hintText="Location Comes Here"
                onClick={() => { navigate(`/dashboard/profile?user=${item.userData.username}-${item.userData._id}`) }}
                imagePath={item.userData.profilePicture}
            />
            <ConditionalRendererWithDefault
                condition={item.mediaType === 'video'}
                component={
                    <Holder style={{ position: "relative" }}>
                        <video
                            style={{ width: "100%", background: "aqua" }}
                            ref={videoRef}
                            muted={isMuted}
                            src={item.media}
                            loop
                        />
                        <button
                            onClick={toggleMute}
                            style={{
                                position: "absolute",
                                background: "rgba(0, 0, 0, 0.5)",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                padding: "5px 10px",
                                cursor: "pointer",
                                right: "0px",
                                bottom: "4px"

                            }}
                        >
                            {isMuted ? "Unmute" : "Mute"}
                        </button>
                    </Holder>
                }

                defaultComponent={<img className="post-image" src={item.media} />}
            />
            <div className="post-footer">
                <Holder direction="horizontal">
                    <SmallIcon
                        onClick={handleClick}
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill={isLiked ? "var(--flamingo)" : "none"}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke={isLiked ? "none" : "currentColor"}
                                className="icon"
                            >
                                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        }
                    />

                    <SmallIcon
                        onClick={() => {
                            dispatch(setPostId(item._id));
                            dispatch(addComments([]));
                            dispatch(toggleCommentBox());
                        }}
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                            </svg>
                        }
                    />

                    <SmallIcon
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 256 256"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="16px"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M80 134.87 170.26 214a8 8 0 0 0 13.09-4.21L224 33.22a1 1 0 0 0-1.34-1.15L20 111.38a6.23 6.23 0 0 0 1 11.92Zm44.37 38.91-30.61 31.76A8 8 0 0 1 80 200v-65.13" />
                            </svg>
                        }
                    />
                </Holder>

                <TextHint text={`${likes} likes`} />

                <Holder direction="horizontal">
                    <p>
                        <b onClick={() => navigate(`/dashboard/profile?user=${item.userData.username}-${item.userData._id}`)}
                        >{item.userData.username}  </b>
                        {item.content}
                    </p>


                </Holder>
            </div>

            <ConditionalRendererWithoutDefault
            condition={options}
            component={<ShowOptions isUser={item.userData._id===userData._id} postId={item._id} cancelClick={()=>showOptions(!options)}/>}/>
            
        </div>
    );
}
