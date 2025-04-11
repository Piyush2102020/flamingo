import React, { CSSProperties } from 'react';

type FieldItems={
    value:string;
    style?:CSSProperties;
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
    placeholder:string;
    classname?:string;
    name?:string;
}


export const BasicInputField:React.FC<FieldItems>=({name,value,style,placeholder,onChange,classname})=>{
    return(
        <input name={name} value={value} style={style} onChange={onChange} placeholder={placeholder} className={`input ${classname}`}/>
    )
}

export const AccentInputField:React.FC<FieldItems>=({name,value,style,placeholder,onChange,classname})=>{
    return(
        <input name={name} value={value} style={style} onChange={onChange} placeholder={placeholder} className={`input ${classname}`}/>
    )
}