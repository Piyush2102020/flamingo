import './style.css';



interface NotificationProps{
    userData:{[key:string]:any},
    type:any,
    contentId:String,
    contentType:String
}

interface Props{
    item:NotificationProps
}
export default function NotificationLayout({item}:Props) {

  const typeMatchTemplates = {
    follow: (user: string, _extra: any) => `${user}  started following you`,
    request: (user: string, _extra: any) => `${user}  wants to follow you`,
    liked: (user: string, type: string) => `${user}  liked your ${type}`,  
    comment: (user: string, _extra: any) => `${user}  commented on your post`,
    reply: (user: string, _extra: any) => `${user}  replied to your comment`,
    mention: (user: string, where: string) => `${user}  mentioned you in a ${where}`,
    tag: (user: string, what: string) => `${user}  tagged you in a ${what}`,
  };

  const getMessage=()=>{
    const template= typeMatchTemplates[item.type];
    return template(item.userData.username,item.contentType)
  }
  return (
    <div className="notification">
        <img src={item.userData.profilePicture?item.userData.profilePicture:"/icons/profile-default.svg"} className='dp-small'/>
        <div className='notification-content'>
            {getMessage()}
        </div>
    </div>
  );
}
