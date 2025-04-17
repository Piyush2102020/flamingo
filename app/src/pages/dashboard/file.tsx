import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/file";
import '../../components/componentsGlobal.css';
import '../../newComponents/newComponents.css';
import '../pageGlobal.css';
import Header from "../../components/header/file";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../../helpers/slice";
import { RootState } from "../../helpers/store";
import CommentBox from "../../components/commentBox/file";
import startSocket from "../../helpers/socketServer";
import Responsive from "../../helpers/responsive";
import { ConditionalRendererWithoutDefault } from "../../newComponents/Generics/GenericConditionlRender/file";
import PleaseWait from "../../components/pnf/pleaseWait";

export default function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const navbarRef = useRef<HTMLDivElement>(null);
    const context = useSelector((state: RootState) => state.context)as any;

    const [navbarHeight, setNavbarHeight] = useState(0);

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
        if (!context.userData._id) return;
        startSocket(context.userData._id, dispatch);
    }, [context.userData._id]);

    
    useEffect(() => {
        if (navbarRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                setNavbarHeight(navbarRef.current!.offsetHeight);
            });

            resizeObserver.observe(navbarRef.current);

            return () => resizeObserver.disconnect();
        }
    }, [context.isMobile]);

    return (
        <div className="dashboard-container">
            <Header />
            <div
                style={context.isMobile ? { flexDirection: "column-reverse" } : {}}
                className="dashboard-section"
            >
                {/* Navbar */}
                <div
                    ref={navbarRef}
                    style={
                        context.isMobile
                            ? {
                                  position: 'fixed',
                                  bottom: '0px',
                                  backgroundColor: 'var(--color-background)',
                                  zIndex: 1,
                                  width: '100%',
                                  flexDirection: 'row',
                              }
                            : {}
                    }
                >
                    <Navbar style={context.isMobile?{flexDirection:"row"}:{}} />
                </div>

                {/* Outlet */}
                <div
                    style={
                        context.isMobile
                            ? {
                                  width: '100vw',
                                  paddingBottom: navbarHeight,
                                  border:"none"
                              }
                            : {}
                    }
                    className="outlet-container"
                >
                    <Outlet />
                </div>
                <ConditionalRendererWithoutDefault
                condition={context.comment.isVisible}
                component={<CommentBox />}

                
            /> 
            <ConditionalRendererWithoutDefault
            condition={context.pleaseWait
            }
            component={<PleaseWait/>}
            />
           
            </div>

           
           
        </div>
    );
}
