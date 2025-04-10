import React from "react";

type RenderProps={
    condition:boolean;
    component:React.ReactNode;
    defaultComponent?:React.ReactNode;
}



export const ConditionalRendererWithDefault:React.FC<RenderProps>=({condition,component,defaultComponent})=>{
    return <>{condition?component:defaultComponent}</>
}

export const ConditionalRendererWithoutDefault:React.FC<RenderProps>=({condition,component})=>{
    return <>{condition&&component}</>
}