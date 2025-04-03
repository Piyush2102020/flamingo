import { useNavigate, useSearchParams } from 'react-router-dom'
import './style.css'
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../helpers/store';
import GenericLoader from '../../../components/GenericLoader/file';
import axiosInstance from '../../../helpers/axiosModified';
import PostComponent from '../../../components/postComponent/file';

export default function Profile() {
    const [params] = useSearchParams();
    const user = params.get('user');
    const username = useMemo(() => user?.split("-")[0], [user]);
    const userId = useMemo(() => user?.split("-")[1], [user]);
    const [profileData, setProfileData] = useState<any>({});
    const userData = useSelector((state: RootState) => state.context.userData) as any;
    const isOwnProfile = userData._id === userId;

    const navigate = useNavigate();

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

    }, [userId, params]);
    return (


        <div className='profile-page'>

            <div className='profile-details'>
                <img src={profileData.profilePicture ? profileData.profilePicture : "/icons/profile-default.svg"} className='dp-large' />
                <div className='profile-text'>
                    {profileData.name}
                    <strong>@{profileData.username}</strong>
                    <div className='meta'>
                        <span><strong>{profileData.postCount}</strong> Posts</span>
                        <span><strong onClick={() => navigate(`/dashboard/info?user=${profileData._id}&type=followers`)}>{profileData.followersCount}</strong> Followers</span>
                        <span><strong onClick={() => navigate(`/dashboard/info?user=${profileData._id}&type=following`)}>{profileData.followingCount}</strong> Following</span>
                    </div>


                </div>

               

            </div>
            {
                !isOwnProfile && <div className='button-holder'>
                    <button
                        onClick={async () => {
                            try {
                                await axiosInstance.put(`/profile/${profileData._id}?action=${profileData.isFollowing ? "unfollow" : "follow"}`);
                                setProfileData((prev: any) => ({
                                    ...prev,
                                    isFollowing: !prev.isFollowing
                                }));
                            } catch (error) {
                                console.error("Error updating follow status:", error);
                            }
                        }}
                        className='btn accent'
                    >
                        {profileData.isFollowing ? "Unfollow" : "Follow"}
                    </button>

                    <button onClick={() => {
                        navigate(`/dashboard/chatbox?user=${profileData.username}-${profileData._id}`)
                    }} className='btn normal'>Message</button>
                </div>
            }
            <div className='profile-mid'>


                {
                    profileData._id &&
                    <GenericLoader url={`/content?uid=${profileData._id}&type=user`} Element={PostComponent} />
                }
            </div>



        </div>
    )
}