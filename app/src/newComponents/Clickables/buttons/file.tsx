import React, { CSSProperties } from 'react'
import './style.css'



type ButtonProps={
    text:string;
    onClick?:()=>void;
    style?:CSSProperties;
}

export const BasicButton:React.FC<ButtonProps>=({text,onClick,style})=>{
    return(
        <button onClick={onClick} style={style} className='btn'>{text}</button>
    )
}

export const AccentButton:React.FC<ButtonProps>=({text,onClick,style})=>{
    return(
        <button onClick={onClick} style={style} className='btn accent'>{text}</button>
    )
}