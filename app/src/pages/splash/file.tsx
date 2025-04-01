import { useEffect } from "react"
import './style.css'
export default function Splash() {
    useEffect(()=>{
        setTimeout(()=>{
            window.location.href='/auth';
        },2000)
    },[])
    return (
        <div className="splash-screen">

            <img className="icon-xl" src="/icons/app_icon.png"/>
            <span className="appname">{import.meta.env.VITE_APP_NAME}</span>
           
            
        </div>
    )
}