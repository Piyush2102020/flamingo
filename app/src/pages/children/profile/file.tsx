import { useNavigate, useSearchParams } from 'react-router-dom'
import './style.css'
import { use, useEffect, useId, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../helpers/store';
import GenericLoader from '../../../components/GenericLoader/file';
import axios from 'axios';
import axiosInstance from '../../../helpers/axiosModified';
import PostComponent from '../../../components/postComponent/file';

export default function Profile() {
    const user = useSearchParams()[0].get('user');
    const [username] = useState(user?.split("-")[0]);
    const [userId] = useState(user?.split("-")[1]);
    const [profileData, setProfileData] = useState<any>({});
    const userData = useSelector((state: RootState) => state.context.userData) as any;
    const isOwnProfile = userData._id === userId;
    const navigate=useNavigate();

    const fetchUserData = async (userId: string) => {
        console.log("Searching for : ", userId);
        const response = await axiosInstance.get(`/user/${userId}`);
        console.log(response);
        
        setProfileData(response);
    }


    useEffect(() => {
        console.log(userId);
        if (userId) {
            fetchUserData(userId);
        }

    }, [userId]);
    return (


        <div className='profile-page'>
           
           <div className='profile-details'>
           <img src={profileData.profilePicture ? profileData.profilePicture : "/icons/profile-default.svg"} className='dp-large' />
            <div className='profile-text'>
            {profileData.name}
                <strong>@{profileData.username}</strong>
                <div className='meta'>
                    <span><strong>{profileData.postCount}</strong> Posts</span>
                    <span><strong>{profileData.followersCount}</strong> Followers</span>
                    <span><strong>{profileData.followingCount}</strong> Following</span>
                    
                </div>
                
                
            </div>
           </div>
           {
                    !isOwnProfile&& <div className='button-holder'>
                    <button className='btn accent'>{profileData.isFollowing?"Unfollow":"Follow"}</button>
                    <button onClick={()=>{
                        navigate(`/dashboard/chatbox?c=${profileData.username}-${profileData._id}-`)
                    }} className='btn normal'>Message</button>
                </div>
                }
            <div className='profile-mid'>

                
            {
            profileData._id&&
            <GenericLoader url={`/content?uid=${profileData._id}&type=user`} Element={PostComponent}/>
            }
            </div>

           
            
        </div>
    )
}