import React, { CSSProperties } from 'react'
import './style.css'



export const TextHint:React.FC<{text:string,classname?:string,onClick?:()=>void,style?:CSSProperties}>=({style,text,classname,onClick})=>{
    return(<p onClick={onClick} style={style} className={`text-light ${classname}`}>{text}</p>)
}
