import React from 'react'
import './style.css'



export const TextHint:React.FC<{text:string,classname?:string}>=({text,classname})=>{
    return(<p className={`text-light ${classname}`}>{text}</p>)
}