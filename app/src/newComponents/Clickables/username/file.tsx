import React from 'react'

export const ClickableUsername:React.FC<{username:string}>=({username})=>{
    return (
        <p>{username}</p>
    )
}