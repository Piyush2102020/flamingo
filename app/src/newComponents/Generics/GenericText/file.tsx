import React from 'react'
import './style.css'



export const TextHint:React.FC<{text:string,classname?:string,onClick?:()=>void}>=({text,classname,onClick})=>{
    return(<p onClick={onClick} className={`text-light ${classname}`}>{text}</p>)
}
