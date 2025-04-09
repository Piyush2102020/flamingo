import { useNavigate, useSearchParams } from 'react-router-dom'
import './style.css'
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../helpers/store';
import GenericLoader from '../../../components/GenericLoader/file';
import axiosInstance from '../../../helpers/axiosModified';
import PostComponent from '../../../components/postComponent/file';
import { updateChatboxMeta } from '../../../helpers/slice';

export default function Profile() {
    const [params] = useSearchParams();
    const user = params.get('user');
    const username = useMemo(() => user?.split("-")[0], [user]);
    const userId = useMemo(() => user?.split("-")[1], [user]);
    const [profileData, setProfileData] = useState<any>({});
    const userData = useSelector((state: RootState) => state.context.userData) as any;
    const inboxes=useSelector((state:RootState)=>state.context.inbox);
    const isOwnProfile = userData._id === userId;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchUserData = async (userId: string) => {
        const response = await axiosInstance.get(`/user/${userId}`);
        console.log(response);
        setProfileData(response);
    }



    const handleAction=async()=>{
        let action=profileData.isFollowing?"unfollow":"follow";
        await axiosInstance.put(`/profile/${profileData._id}?action=${action}`);
        setProfileData({...profileData,isFollowing:!profileData.isFollowing})
      
    }

    useEffect(() => {
        console.log(userId);
        if (userId) {
            fetchUserData(userId);
        }



    }, [userId, params]);
    return (


        <div className='profile-page'>

            <div className='profile-info'>
                <div style={{ display: "flex", gap: "var(--gap-large)" }}>
                    <img src={profileData.profilePicture ? profileData.profilePicture : "/icons/profile-default.svg"} className='dp-large' />
                    <div className='profile-text'>
                        <h4>{profileData.name}<br />
                            @{profileData.username}
                        </h4>
                        <p >{profileData.bio}</p>
                        {profileData.links?.trim() &&
                            <a className='text-light' href={profileData.links} target='_blank'>Visit link</a>
                        }
                    </div>
                    {isOwnProfile && <svg onClick={() => navigate('/dashboard/settings')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>

                    }
                </div>

                <div className='meta'>
                    <div className='meta-item'><h4>{profileData.postCount}</h4> <span className='text-light'>Posts</span></div>
                    <div className='border'></div>
                    <div className='meta-item'><h4>{profileData.followersCount} </h4><span className='text-light'>Followers</span></div>
                    <div className='border'></div>
                    <div className='meta-item'><h4>{profileData.followingCount}</h4> <span className='text-light'>Following</span></div>
                </div>

                {
                    !isOwnProfile &&
                    <div className='button-holder'>
                        <button onClick={handleAction} className='btn accent'>{profileData.isFollowing ? "Unfollow" : "Follow"}</button>
                        <button
                        onClick={()=>{
                            console.log(profileData._id);
                            dispatch(updateChatboxMeta({chatboxId:""}));
                            for(let val of inboxes){
                                console.log(val);
                                if(val.userId===profileData._id){
                                    console.log("User found adding chat");
                                    dispatch(updateChatboxMeta({     
                                        chatboxId:val.chatboxId,
                                    }))
                                    break;
                                }
                            }

                            dispatch(updateChatboxMeta({
                                receiverId:profileData._id,
                                receiverUsername:profileData.username,
                                receiverProfilePicture:profileData.profilePicture,
                               
                            }))
                            navigate('/dashboard/chatbox')
                        }}
                        className='btn'>Message</button>
                    </div>
                }
            </div>

            <div className='profile-content-display'>

                {
                    isOwnProfile ? profileData._id ? <GenericLoader url={`/content?type=user&uid=${profileData._id}`} Element={PostComponent} /> : "Loading Posts..." : profileData.isFollowing ?
                        profileData._id ? <GenericLoader url={`/content?type=user&uid=${profileData._id}`} Element={PostComponent} /> : "Loading Posts..." : <div className='private-account'>
                            <div style={{ padding: "var(--padding-small)", border: "1px dashed currentColor", borderRadius: "50%", width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center" }} className='lock-icon'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>

                            </div>
                            <h2>Account is Private</h2>
                            <p className='text-light'>Follow them to see their posts</p>
                        </div>
                }



            </div>
        </div>
    )
}