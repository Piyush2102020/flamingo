import { useNavigate } from "react-router-dom";

import './style.css'
import React from "react";

interface HeaderProps {
    profilePic: string; 
    username: string;
    content: string; 
    timestamp: string; 
    redirectUrl: string; 
    clickMode: "username" | "header"; 
    icons?:'show'|'hidden';
    style?:React.CSSProperties
  }

  export default function GenericHeader({profilePic,username,content,timestamp,redirectUrl,clickMode,icons="hidden",style={}}:HeaderProps){

  
    console.log("PP : ",profilePic);
    
    const navigate=useNavigate();
  function handleClick(){
    
    navigate(redirectUrl);  
}

    return(
        <div style={style} onClick={clickMode=="header"?handleClick:undefined} className="generic-header">
            <img className="dp-small" src={profilePic?profilePic:"/icons/profile-default.svg"}/>
            <div className="generic-content">
                <div className="text-bold"><strong onClick={clickMode=="username"?handleClick:undefined}>{username}</strong>
                {icons=="show"?"•":""}<p className="text-light">{timestamp}</p></div>
                <span className="text-light">{content}</span>
            </div>


{
  icons=="show"&&
  <div className="option">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
      </div>
  
}
           
</div>
           
    )
  }