import { useEffect, useState } from "react"
import axiosInstance from "../../../helpers/axiosModified";

export default function Notifications(){
    const [notifications,setNotification]=useState<[any]|null>(null);


    const loadNotification=async()=>{
        const notification=await axiosInstance.get('notification') as any;
        console.log("Notifactions : ",notification);
        setNotification(notification);
    }

    useEffect(()=>{
       
        loadNotification();
    },[]);
    return (
        <div>
            <h1>Notifications</h1>

            <div className="notification loader">
                {notifications &&notifications.length>0?
                notifications.map((value)=><h3>{value._id}</h3>):
                <p>No new notification</p>}
            </div>
        </div>
    )
}