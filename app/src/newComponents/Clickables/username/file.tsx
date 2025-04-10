import React from 'react'
import './style.css'


export const ClickableUsername:React.FC<{username:string}>=({username})=>{
    return (
        <p>{username}</p>
    )
}