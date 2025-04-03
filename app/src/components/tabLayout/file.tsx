import { useEffect, useState, useMemo } from "react";
import GenericLoader from "../GenericLoader/file";
import { useSearchParams } from "react-router-dom";
import './style.css'
import axiosInstance from "../../helpers/axiosModified";
import GenericHeader from "../GenericHeader/file";

export default function TabLayout() {
    const [params, setParams] = useSearchParams();

    const id = useMemo(() => params.get("user"), [params]);
    const selectedTab = useMemo(() => params.get("type") || "followers", [params]); 

    const [followers, setFollowers] = useState<any[]>([]);

    const loadFollowers = async () => {
        if (!id) return;
        try {
            const response = await axiosInstance.get(`/profile/${id}?type=${selectedTab}&page=1`);
            setFollowers(response);  
        } catch (error) {
            console.error("Failed to fetch followers:", error);
        }
    };

    useEffect(() => {
        loadFollowers();
    }, [id, selectedTab]); 

    const updateTab = (tabType: string) => {
        params.set("type", tabType);
        setParams(params); 
    };

    return (
        <div className="tab-layout">
            <div className="tabs">
                <div 
                    onClick={() => updateTab("followers")} 
                    className={`tab-item ${selectedTab === "followers" ? "tab-item-active" : ""}`}
                >
                    Followers
                </div>
                <div 
                    onClick={() => updateTab("following")} 
                    className={`tab-item ${selectedTab === "following" ? "tab-item-active" : ""}`}
                >
                    Following
                </div>
            </div>
            <div className="tab-viewport">
                {followers ?
                    followers.map((value) => (
                        <GenericHeader 
                            key={value._id}
                            clickMode="header" 
                            profilePic={value.profilePicture} 
                            username={value.username}
                            redirectUrl={`/dashboard/profile?user=${value.username}-${value._id}`} 
                        />
                    )
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </div>
    );
}
