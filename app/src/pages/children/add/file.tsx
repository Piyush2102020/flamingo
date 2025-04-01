import { useSelector } from "react-redux";
import { RootState } from "../../../helpers/store";
import React, { useRef, useState } from "react";
import "./style.css";
import axiosInstance from "../../../helpers/axiosModified";

export default function AddPost() {
    const [content, setContent] = useState("");
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const userData = useSelector((state: RootState) => state.context.userData) as any;
    const contentRef = useRef<HTMLDivElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [visibility, setVisibility] = useState("public");

    const handleInput = () => {
        if (contentRef.current) {
            setContent(contentRef.current.innerHTML);
        }
    };

    const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setSelectedItem(URL.createObjectURL(file));
        }
    };

    const triggerFilePicker = () => {
        fileInputRef.current?.click();
    };

    const [location, setLocation] = useState<string | null>(null);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                setLocation(data.display_name);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleSubmit = async () => {
        if (!content.trim() && !selectedFile) {
            alert("Please add some content or an image.");
            return;
        }

        const formData = new FormData();
        formData.append("content", content);
        formData.append("visibility", visibility.toLowerCase());
        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        try {
            const response = await axiosInstance.post("/content", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
            );
            console.log("Post successful:", response.data);
            setContent("");
            setSelectedFile(null);
            setSelectedItem(null);
            if (contentRef.current) contentRef.current.innerHTML = "";
        } catch (error) {
            console.error("Error posting content:", error);
        }
    };

    return (
        <div className="post-page">
            <div className="post-header">
                {userData.profilePicture ? <img src={userData.profilePicture} />
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                }

                <div className="section1">
                    <strong>{userData.username}</strong>
                    <p contentEditable={true} onClick={getLocation}>{location == null ? "Click to add location" : location}</p>
                </div>

                <button onClick={handleSubmit} className="accent-btn">Post</button>
            </div>

            <div
                contentEditable={true}
                suppressContentEditableWarning={true}
                className={`editable-box ${content.trim() === "" ? "empty" : ""}`}
                onInput={handleInput}
                ref={contentRef}
                data-placeholder="What's on your mind?"
            ></div>

            <div className="media-selection">

                <input
                    ref={fileInputRef}
                    className="file-picker"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImage}
                />


                <div onClick={triggerFilePicker} style={{ cursor: "pointer" }}>
                    <img className="icons" src="/icons/gallery.png" alt="Add Image" />
                </div>

                <select className="spinner" onChange={(event) => setVisibility(event.target.value)}>
                    <option>Public</option>
                    <option>Private</option>
                </select>
            </div>

            {selectedItem && (
                <div className="image-preview-container">
                    <button className="cancel-button" onClick={() => { setSelectedItem(null) }}>X</button>
                    <img className="image-preview" src={selectedItem} alt="Selected Preview" />
                </div>
            )}
        </div>
    );
}
