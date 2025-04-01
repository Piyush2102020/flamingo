import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/file";
import './style.css'
import Header from "../../components/header/file";
import SideBarContainer from "../../components/sidebars/sidebarContainer/file";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../../helpers/slice";
import { RootState } from "../../helpers/store";
import CommentBox from "../../components/commentBox/file";
export default function Dashboard() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const commentBoxVisibility=useSelector((state:RootState)=>state.context.comment.isVisible);


    
    useEffect(() => {
        if (!window.location.pathname.includes('home')) {
            navigate('home');
        }

        const token = localStorage.getItem('token');
        if (token) {
            const data = jwtDecode(token);
            dispatch(addData(data))

        }

    }, [])
    return (


        <div className="dashboard-container">
            
    {commentBoxVisibility&&<CommentBox/>}
            <Header />
            
            <div className="dashboard-section">
                <Navbar />
                <div className="outlet-container">
                    <Outlet />
                </div>

                <SideBarContainer />
            </div>
            
    
        </div>

    );
}
