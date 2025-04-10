import React, { CSSProperties } from 'react';
import './style.css'


type FieldItems={
    value:string;
    style?:CSSProperties;
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
    placeholder:string;
    classname?:string;
}


export const BasicInputField:React.FC<FieldItems>=({value,style,placeholder,onChange,classname})=>{
    return(
        <input value={value} style={style} onChange={onChange} placeholder={placeholder} className={`input ${classname}`}/>
    )
}

export const AccentInputField:React.FC<FieldItems>=({value,style,placeholder,onChange,classname})=>{
    return(
        <input value={value} style={style} onChange={onChange} placeholder={placeholder} className={`input ${classname}`}/>
    )
}