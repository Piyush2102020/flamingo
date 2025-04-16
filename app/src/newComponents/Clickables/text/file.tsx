import React from 'react';


type TextProps={
    text:string;
    onClick?:()=>void
}


export const ClickablePara:React.FC<TextProps>=({text ,onClick})=>{
    return (<p  onClick={onClick}>{text}</p>)
}


export const ClickableBoldText:React.FC<TextProps>=({text ,onClick})=>{
    return (<b style={{zIndex:100}} onClick={onClick}>{text}</b>)
}