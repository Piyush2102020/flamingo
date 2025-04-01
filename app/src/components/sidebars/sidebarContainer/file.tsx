import { useEffect } from "react";
import {  useSearchParams } from "react-router-dom";
import Trending from "../trending/file";
import Suggestions from "../suggestions/file";
import './style.css'
export default function SideBarContainer(){
     
   

return(
    <div className="sideBar-container">
                <Trending/>
            </div>
)
}