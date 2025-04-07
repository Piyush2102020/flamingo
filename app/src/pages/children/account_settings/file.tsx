import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../helpers/store"

import './style.css'
import React, { useState } from "react";
import axiosInstance from "../../../helpers/axiosModified";
import { addData } from "../../../helpers/slice";
import { useNavigate } from "react-router-dom";

export default function Settings() {


    const userData = useSelector((state: RootState) => state.context.userData) as any;
    const [localData, setLocalData] = useState(userData) as any;
    const dispatch=useDispatch();
    const navigate=useNavigate();


    const handlePicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const formData = new FormData();
            formData.append('image', event.target.files[0]);
    
            const updateProfilePic = await axiosInstance.post('/updateprofilepicture', formData, {
                headers: { "Content-Type": "multipart/form-data" },
            }) as any;

            
            const newLocalData = { ...localData, profdilePicture: updateProfilePic.link };
        
            
            setLocalData(newLocalData);
            dispatch(addData(newLocalData));
        }
    };
    
    const updateProfile=async()=>{
        const updatedData=await axiosInstance.post('/updateprofile',localData) as any;
        console.log("Updated Data : ",updatedData);
        dispatch(addData(updatedData.newData));
        localStorage.setItem('token',updatedData.token);
    }

    return (
        <div className="settings-page">
            {localData != userData && <button className="btn accent" style={{ width: "fit-content", alignSelf: "flex-end" }} onClick={updateProfile}>Save Changes</button>}
            <div style={{ position: "relative" }}>
                <input onChange={handlePicChange} type="file" accept="image/*" style={{ position: "absolute", opacity: "0", width: "100%", height: "100%" }} />
                <img className="dp-large" src={localData.profilePicture ? localData.profilePicture : "/icons/profile-default.svg"} />
            </div>

            <span className="text-light">Tap here to change</span>

            <div className="settings-field">
                <span className="text-accent">User Info</span>
                <div>
                    <span className="text-light">Name</span>
                    <input onChange={(e) => setLocalData({ ...localData,name: e.target.value })} value={localData.name} placeholder="Name" className="input" />
                </div>

                <div>

                    <span className="text-light">Username</span>
                    <input onChange={(e) => setLocalData({ ...localData, username: e.target.value })} value={localData.username} placeholder="Username" className="input" />
                </div>

                <div>

                    <span className="text-light">Bio</span>
                    <input onChange={(e) => setLocalData({ ...localData, bio: e.target.value })} value={localData.bio} placeholder="Bio" className="input" />
                </div>



                <div>

                    <span className="text-light">Links</span>
                    <input onChange={(e) => setLocalData({ ...localData, links: e.target.value })} value={localData.links} placeholder="Add Website link" className="input" />
                </div>


                <div>
                    <span className="text-light">Links</span>
                    <input onChange={(e) => setLocalData({ ...localData, dob: e.target.value })}  type="date" placeholder="Add Website link" className="input" />
                </div>


                <div>
                    <span className="text-light">Email  (Cant Be Changed)</span>
                    <div className="input text-light" >{localData.email}</div>
                </div>

                <div className="radio-group">
                    <label>
                        <input
                            name="gender"
                            type="radio"
                            value="Male"
                            checked={localData.gender === "Male"}
                            onChange={(e) => setLocalData({ ...localData, gender: e.target.value })}
                        />
                        Male
                    </label>

                    <label>
                        <input
                            name="gender"
                            type="radio"
                            value="Female"
                            checked={localData.gender === "Female"}
                            onChange={(e) => setLocalData({ ...localData, gender: e.target.value })}
                        />
                        Female
                    </label>

                    <label>
                        <input
                            name="gender"
                            type="radio"
                            value="Not-specified"
                            checked={localData.gender === "Not-specified"}
                            onChange={(e) => setLocalData({ ...localData, gender: e.target.value })}
                        />
                        Not-specified
                    </label>
                </div>



                <span className="text-accent">Privacy Settings</span>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-medium)" }}>
                    <span className="text-light">Account Visibility</span>
                    <select onChange={e => setLocalData({ ...userData, accountVisibility: e.target.value.toLowerCase() })} value={localData.accountVisibility} className="select">
                        <option>public</option>
                        <option>private</option>
                    </select>
                </div>


                <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-medium)" }}>
                    <span className="text-light">Allow Direct Message from</span>
                    <select onChange={e => setLocalData({ ...userData, messageAllowed: e.target.value.toLowerCase() })} value={localData.messageAllowed} className="select">
                        <option>everyone</option>
                        <option>followers</option>
                        <option>no one</option>
                    </select>
                </div>


                <span className="text-accent">Security Settings</span>

                <button className="btn" onClick={()=>navigate('/auth/forgetpassword')}>Change Password</button>
                <button className="btn accent">Delete My Account</button>

            </div>


        </div>

    )
}