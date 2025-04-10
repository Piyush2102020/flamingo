import { useEffect, useState } from "react"
import axiosInstance from "../../../helpers/axiosModified";
import NotificationLayout from "../../../components/notification-layout/file";
import './style.css'
import { GenericHeader } from "../../../newComponents/Generics/GenericHeader/file";
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

    
interface NotificationProps{
    userData:{[key:string]:any},
    type:string,
    contentId:String,
    contentType:String
}

interface Props{
    item:NotificationProps
}

    const typeMatchTemplates = {
        follow: (user: string, _extra: any) => `started following you`,
        request: (user: string, _extra: any) => `${user}  wants to follow you`,
        liked: (user: string, type: string) => `${user}  liked your ${type}`,  
        comment: (user: string, _extra: any) => `${user}  commented on your post`,
        reply: (user: string, _extra: any) => `${user}  replied to your comment`,
        mention: (user: string, where: string) => `${user}  mentioned you in a ${where}`,
        tag: (user: string, what: string) => `${user}  tagged you in a ${what}`,
      };
    
      const getMessage=(type:string)=>{
        const template= typeMatchTemplates[type];
        return template()
      }


    return (
        <div>
            <h1>Notifications</h1>

            <div className="notificationloader">
                {notifications &&notifications.length>0?
                notifications.map((value:any,index)=>{
                    return(
                        <GenericHeader key={index}
                        clickType="text"
                        imagePath={value.userData.profilePicture}
                        decorate={false}
                        showIcon={false}
                        content={getMessage(value.type)}
                        headText={value.userData.username}/>
                    )
                }):
                <p>No new notification</p>}
            </div>
        </div>
    )
}