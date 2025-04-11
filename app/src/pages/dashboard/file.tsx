import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/file";
import '../../components/componentsGlobal.css'
import '../../newComponents/newComponents.css'
import '../pageGlobal.css'
import Header from "../../components/header/file";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../../helpers/slice";
import { RootState } from "../../helpers/store";
import CommentBox from "../../components/commentBox/file";
import startSocket from "../../helpers/socketServer";
import Responsive from "../../helpers/responsive";
import { ConditionalRendererWithoutDefault } from "../../newComponents/Generics/GenericConditionlRender/file";
export default function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const context=useSelector((state:RootState)=>state.context) as any;

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

    useEffect(() => {
        if(!context.userData._id)return;
        startSocket(context.userData._id)
    }, [context.userData._id]);

    return (


        <div className="dashboard-container">
            <ConditionalRendererWithoutDefault condition={context.comment.isVisible} component={<CommentBox />} />
            <Header />

            <div style={context.isMobile ? { flexDirection: "column-reverse" } : {}} className="dashboard-section">
                <Navbar style={context.isMobile ? { position: "fixed", bottom: "0px", backgroundColor: "var(--color-background)", zIndex: "200", flexDirection: "row" } : {}} />
                <div style={context.isMobile ? { width: window.innerWidth } : {}} className="outlet-container">
                    <Outlet />
                </div>


            </div>


        </div>

    );
}
