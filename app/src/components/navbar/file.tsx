import { CSSProperties, useState } from "react";
import { useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../helpers/store";
import {  toggleCommentBox, toggleMessage, toggleNotification } from "../../helpers/slice";

export default function Navbar({style}:{style:CSSProperties}) {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState("home");
    const context=useSelector((state:RootState)=>state.context) as any;
    const dispatch=useDispatch();

    const handleSelection = (route: string) => {
        if(context.comment.isVisible){
            dispatch(toggleCommentBox());
        }
        setSelectedTab(route);
        navigate(`/dashboard/${route}`);
    };

    return (
        <div style={style} className="navbar">
            <div
                className={`nav-item ${selectedTab === "home" ? "active" : ""}`}
                onClick={() => handleSelection("home")}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20Z" />
                </svg>

                {!context.isMobile&& "Home"}
            </div>

            <div
                className={`nav-item ${selectedTab === "search" ? "active" : ""}`}
                onClick={() => handleSelection("search")}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M112 192a80 80 0 1 1 80-80 80 80 0 0 1-80 80Zm56.57-23.43 55.43 55.43" />
                </svg>
                {!context.isMobile&& "Search"}
            </div>

            <div
                className={`nav-item ${selectedTab === "create" ? "active" : ""}`}
                onClick={() => handleSelection("create")}
                style={{ display: "flex", alignItems: "center", gap: "8px", color: "inherit" }} // Ensure color inheritance
            >
                <svg
                    width="30"
                    height="30"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ stroke: "currentColor", fill: "none" }}
                >
                    <line x1="50" y1="20" x2="50" y2="80" strokeWidth="10" strokeLinecap="round" />
                    <line x1="20" y1="50" x2="80" y2="50" strokeWidth="10" strokeLinecap="round" />
                </svg>
                {!context.isMobile&& "Create"}
            </div>




            <div
                className={`nav-item ${context.newMessage?"glow":" "} ${selectedTab === "direct" ? "active" : ""}`}
                onClick={() =>{ 
                    if(context.newMessage){
                        dispatch(toggleMessage())
                    }
                    ;handleSelection("direct")}}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M80 134.87 170.26 214a8 8 0 0 0 13.09-4.21L224 33.22a1 1 0 0 0-1.34-1.15L20 111.38a6.23 6.23 0 0 0 1 11.92Zm44.37 38.91-30.61 31.76A8 8 0 0 1 80 200v-65.13" />
                </svg>
                {!context.isMobile&& "Direct"}
            </div>

            <div
                className={`nav-item ${context.newNotification?"glow":" "} ${selectedTab === "notification" ? "active" : ""}`}
                onClick={() => {
                    if(context.newNotification){
                        dispatch(toggleNotification())
                    }
                    setSelectedTab("notification");
                    navigate(`/dashboard/notification?user=${context.userData.username}-${context.userData._id}}`)
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                {!context.isMobile&& "Alerts"}
            </div>

            <div
                className={`nav-item ${selectedTab === "profile" ? "active" : ""}`}
                onClick={() => {
                    setSelectedTab("profile");
                    navigate(`/dashboard/profile?user=${context.userData.username}-${context.userData._id}`)
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M128 160a64 64 0 1 1 64-64 64 64 0 0 1-64 64Zm96 56c-19.37-33.47-54.55-56-96-56s-76.63 22.53-96 56" />
                </svg>
                {!context.isMobile&& "Profile"}
            </div>

            <audio id="background-audio" src="/birds-chirp-153780.mp3"/>
        </div>
    );
}
