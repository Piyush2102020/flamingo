import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/file";
import './style.css'
import Header from "../../components/header/file";
import SideBarContainer from "../../components/sidebars/sidebarContainer/file";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../../helpers/slice";
import { RootState } from "../../helpers/store";
import CommentBox from "../../components/commentBox/file";
import startSocket from "../../helpers/socketServer";
import Responsive from "../../helpers/responsive";
export default function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const commentBoxVisibility=useSelector((state:RootState)=>state.context.comment.isVisible);
    const isMobile=useSelector((state:RootState)=>state.context.isMobile);
    const currentUser=useSelector((state:RootState)=>state.context.userData);
    Responsive();
    useEffect(() => {
        if (!window.location.pathname.includes('home')) {
            navigate('home');
        }
        const token = localStorage.getItem('token');
        if (token) {
            const data = jwtDecode(token);
            dispatch(addData(data));
        }
        }, []);

        useEffect(()=>{
          startSocket(currentUser._id)
        },[currentUser])

    return (


        <div className="dashboard-container">
       
            
    {commentBoxVisibility&&<CommentBox/>}
            <Header />
            
            <div style={isMobile?{flexDirection:"column-reverse"}:{}} className="dashboard-section">
                <Navbar style={isMobile?{position:"fixed",bottom:"0px",backgroundColor:"var(--color-background)",zIndex:"200",flexDirection:"row"}:{}} />
                <div style={isMobile?{width:window.innerWidth}:{}} className="outlet-container">
                    <Outlet />
                </div>

{
   !isMobile&&
    <SideBarContainer />
}
                
            </div>
            
    
        </div>

    );
}
