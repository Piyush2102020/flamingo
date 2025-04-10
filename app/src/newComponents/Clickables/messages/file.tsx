import './style.css'
import { Holder } from '../../Generics/GenericHolders/file';
import { SmallImage } from '../icons/file';
import { TextHint } from '../../Generics/GenericText/file';

type messageContent={
    senderId:string;
    receiverId:string;
    text:string;
    createdAt:string;
    receiverProfilePicture:string;
    isSender:boolean;
}

interface LayoutProps{
    item:messageContent
}
export const ReceiverMessageLayout=({item}:LayoutProps)=>{
    return(
        <Holder classname='receiver'  direction='horizontal'>
            <SmallImage  style={{width:"22px",height:"22px"}}  imgPath={item.receiverProfilePicture}/>
            <Holder classname={`base-message background-receiver`}>
                {item.text}
                <TextHint style={{
                    margin:"2px",
                    width:"95%",
                    textAlign:"right"
                }}  text={new Date(item.createdAt).toLocaleTimeString([],
                    {hour:'2-digit',
                        minute:'2-digit',
                        hour12:true
                    }
                )}/>
            </Holder>
        </Holder>
    )
}


export const SenderMessageLayout=({item}:LayoutProps)=>{
    return(
        <Holder classname='sender'  direction='horizontal'>
           
            <Holder classname={`base-message background-sender`}>
                {item.text}
                <TextHint style={{ margin:"2px"}}  text={new Date(item.createdAt).toLocaleTimeString([],
                    {hour:'2-digit',
                        minute:'2-digit',
                        hour12:true
                    }
                )}/>
            </Holder>
            <SmallImage  style={{width:"22px",height:"22px"}}  imgPath={item.receiverProfilePicture}/>
        </Holder>
    )
}