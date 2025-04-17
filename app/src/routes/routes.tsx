import { Navigate, useRoutes } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";
import Auth from "../pages/auth/file";
import Splash from "../pages/splash/file";
import Dashboard from "../pages/dashboard/file";
import Home from "../pages/children/home/file";
import Search from "../pages/children/search/file";
import AddPost from "../pages/children/add/file";
import Chat from "../pages/children/chat/file";
import Profile from "../pages/children/profile/file";

import Pnf from "../components/pnf/file";
import Forgetpassword from "../pages/passwordReset/file";
import Notifications from "../pages/children/notification/file";
import RealtimeChatBox from "../components/realtimeChatbox/file";
import Settings from "../pages/children/account_settings/file";
import PostComponent from "../components/postComponent/file";
import PostPreview from "../components/postComponent/postPreview";
import FollowersTab from "../components/tabs/file";

export default function Routes() {
    const routes = useRoutes([
        { path: "/", element: <Splash /> },
        {
            path: "/auth",
            children: [
                { path: '', element: <Auth /> }
                , { path: "forgetpassword", element: <Forgetpassword /> }]
        },
        {
            path: "/dashboard",
            element: (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            ),
            children: [
                { index: true, element: <Navigate to="/dashboard/home" replace /> },
                { path: "home", element: <Home /> },
                { path: "search", element: <Search /> },
                { path: "create", element: <AddPost /> },
                { path: "direct", element: <Chat /> },
                { path: "profile", element: <Profile /> },
                { path: "chatbox", element: <RealtimeChatBox/> },
                { path: "notification" ,element:<Notifications/>},
                {path:"settings",element:<Settings/>},
                {path:'profile/:id/:type',element:<FollowersTab/>},
                {path:"post/:id",element:<PostPreview/>}
            ]
        },
        { path: '/*', element: <Pnf text="Uh-oh! Even our flamingo can’t find this one" /> }
    ]);

    return routes;
}
