import { act, useEffect, useState } from "react"
import axiosInstance from "../../../helpers/axiosModified";
import { GenericHeader } from "../../../newComponents/Generics/GenericHeader/file";
import { useSelector } from "react-redux";
import { RootState } from "../../../helpers/store";
import { Holder } from "../../../newComponents/Generics/GenericHolders/file";
import { ConditionalRendererWithoutDefault } from "../../../newComponents/Generics/GenericConditionlRender/file";
import { AccentButton, BasicButton } from "../../../newComponents/Clickables/buttons/file";
import { useNavigate } from "react-router-dom";
export default function Notifications(){
    const [notifications,setNotification]=useState<[any]|null>(null);
    const [requests,setRequests]=useState<[]>([])
    const context=useSelector((state:RootState)=>state.context);
    const navigate=useNavigate();

    const loadNotification=async()=>{
        const notification=await axiosInstance.get('notification') as any;
        console.log("Notifactions : ",notification);
        setNotification(notification);
    }

    useEffect(()=>{
        loadNotification();
    axiosInstance.get('/requests').then((data)=>{
            setRequests(data.userRequests);
        }).catch(e=>console.log(e));
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
      const handleRequest=(action:string,id:string)=>{
        axiosInstance.post(`/requests/${action}?id=${id}`);
      }

    return (
        <div>
            <h1>Notifications</h1>
            <ConditionalRendererWithoutDefault
            condition={context.userData.accountVisibility=='private' && requests.length>0}
            component={<Holder>
                <h2>User Requests</h2>
                {requests.map((value:any,index)=><GenericHeader onClick={()=>navigate(`/dashboard/profile?user=${value.username}-${value._id}`)} key={index} imagePath={value.profilePicture} clickType="text" headText={value.username} showIcon={false} decorate={false} hintText="wants to follow you">
                    <AccentButton onClick={()=>handleRequest('accept',value._id)} text="Accept"/>
                    <BasicButton onClick={()=>handleRequest('reject',value._id)} text="Reject"/>
                </GenericHeader>)}
            </Holder>}
            />
            
        
        </div>
    )
}