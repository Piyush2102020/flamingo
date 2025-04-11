import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../helpers/store"
import React, { useState } from "react";
import axiosInstance from "../../../helpers/axiosModified";
import { addData } from "../../../helpers/slice";
import { useNavigate } from "react-router-dom";
import { MediumImage } from "../../../newComponents/Clickables/icons/file";
import { TextHint } from "../../../newComponents/Generics/GenericText/file";
import { BasicInputField } from "../../../newComponents/Clickables/fields/file";
import { Holder } from "../../../newComponents/Generics/GenericHolders/file";
import { AccentButton, BasicButton } from "../../../newComponents/Clickables/buttons/file";

export default function Settings() {


    const userData = useSelector((state: RootState) => state.context.userData) as any;
    const [localData, setLocalData] = useState(userData) as any;
    const dispatch = useDispatch();
    const navigate = useNavigate();


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

    const updateProfile = async () => {
        const updatedData = await axiosInstance.post('/updateprofile', localData) as any;
        console.log("Updated Data : ", updatedData);
        dispatch(addData(updatedData.newData));
        localStorage.setItem('token', updatedData.token);
    }

    return (
        <div className="settings-page">
            {localData != userData &&
            <AccentButton style={{ width: "fit-content", alignSelf: "flex-end" }} onClick={updateProfile} text="Save Changes"/>
           }
            <div style={{ position: "relative" }}>
                <input onChange={handlePicChange} type="file" accept="image/*" style={{ position: "absolute", opacity: "0", width: "100%", height: "100%" }} />
                <MediumImage imgPath={localData.profilePicture} />
            </div>

            <TextHint text="Tap here to change" />

            <div className="settings-field">
                <TextHint classname="text-accent" text="User info" />

                <TextHint text="Name" />
                <BasicInputField onChange={(e) => setLocalData({ ...localData, name: e.target.value })} value={localData.name} placeholder="Name" />

                <TextHint text="Username" />
                <BasicInputField onChange={(e) => setLocalData({ ...localData, username: e.target.value })} value={localData.username} placeholder="Username" />

                <TextHint text="Bio" />
                <BasicInputField onChange={(e) => setLocalData({ ...localData, bio: e.target.value })} value={localData.bio} placeholder="Bio" />

                <TextHint text="Links" />
                <BasicInputField onChange={(e) => setLocalData({ ...localData, links: e.target.value })} value={localData.links} placeholder="Add Website link" />


                <TextHint text="Email  (Cant Be Changed)" />
                <div className="input text-light" >{localData.email}</div>


                <Holder direction="horizontal" classname="radio-group">
                    <label>
                        <input
                            name="gender"
                            type="radio"
                            value="male"
                            checked={localData.gender === "male"}
                            onChange={(e) => setLocalData({ ...localData, gender: e.target.value })}
                        />
                        Male
                    </label>

                    <label>
                        <input
                            name="gender"
                            type="radio"
                            value="female"
                            checked={localData.gender === "female"}
                            onChange={(e) => setLocalData({ ...localData, gender: e.target.value })}
                        />
                        Female
                    </label>

                    <label>
                        <input
                            name="gender"
                            type="radio"
                            value="not-specified"
                            checked={localData.gender === "not-specified"}
                            onChange={(e) => setLocalData({ ...localData, gender: e.target.value })}
                        />
                        Not-specified
                    </label>

                </Holder>


                <TextHint classname="text-accent" text="Privacy Settings" />

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-medium)" }}>
                    <TextHint text="Account Visibility" />

                    <select onChange={e => setLocalData({ ...userData, accountVisibility: e.target.value.toLowerCase() })} value={localData.accountVisibility} className="select">
                        <option>public</option>
                        <option>private</option>
                    </select>
                </div>


                <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-medium)" }}>
                    <TextHint text="Allow Direct Messages From" />
                    <select onChange={e => setLocalData({ ...userData, messageAllowed: e.target.value.toLowerCase() })} value={localData.messageAllowed} className="select">
                        <option>everyone</option>
                        <option>followers</option>
                        <option>no one</option>
                    </select>
                </div>


                <TextHint classname="text-accent" text="Security Settings" />

                <BasicButton onClick={() => navigate('/auth/forgetpassword')} text="Change Password" />
                <AccentButton text="Delete My Account" />

            </div>


        </div>

    )
}