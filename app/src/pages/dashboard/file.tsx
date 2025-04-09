import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/file";
import "./style.css";
import Header from "../../components/header/file";
import SideBarContainer from "../../components/sidebars/sidebarContainer/file";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../../helpers/slice";
import { RootState } from "../../helpers/store";
import CommentBox from "../../components/commentBox/file";
import startSocket, { getSocket } from "../../helpers/socketServer";
import Responsive from "../../helpers/responsive";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const commentBoxVisibility = useSelector((state: RootState) => state.context.comment.isVisible);
  const isMobile = useSelector((state: RootState) => state.context.isMobile);
  const userData = useSelector((state: RootState) => state.context.userData);

  Responsive();

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    if (token) {
      const data = jwtDecode(token);
      dispatch(addData(data));
    }

    if (!window.location.pathname.includes("home")) {
      navigate("home");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (userData?._id && !getSocket()) {
      startSocket(userData._id);
    }
  }, [userData]);
  

  return (
    <div className="dashboard-container">
      {commentBoxVisibility && <CommentBox />}
      
      <Header />

      <div
        className="dashboard-section"
        style={isMobile ? { flexDirection: "column-reverse" } : {}}
      >
        <Navbar
          style={
            isMobile
              ? {
                  position: "fixed",
                  bottom: "0px",
                  backgroundColor: "var(--color-background)",
                  zIndex: 200,
                  flexDirection: "row",
                }
              : {}
          }
        />

        <div
          className="outlet-container"
          style={isMobile ? { width: window.innerWidth } : {}}
        >
          <Outlet />
        </div>

        {!isMobile && <SideBarContainer />}
      </div>
    </div>
  );
}
