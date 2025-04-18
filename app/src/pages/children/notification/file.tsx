import { act, useEffect, useState } from "react"
import axiosInstance from "../../../helpers/axiosModified";
import { GenericHeader } from "../../../newComponents/Generics/GenericHeader/file";
import { useSelector } from "react-redux";
import { RootState } from "../../../helpers/store";
import { Holder } from "../../../newComponents/Generics/GenericHolders/file";
import { ConditionalRendererWithoutDefault } from "../../../newComponents/Generics/GenericConditionlRender/file";
import { AccentButton, BasicButton } from "../../../newComponents/Clickables/buttons/file";
import { useNavigate } from "react-router-dom";
import { ServerRoutes } from "../../../helpers/serverRoutes";
export default function Notifications() {
    const [notifications, setNotification] = useState<[any] | null>(null);
    const [requests, setRequests] = useState<[]>([])
    const context = useSelector((state: RootState) => state.context);
    const navigate = useNavigate();

    const loadNotification = async () => {
        const notification = await axiosInstance.get('notification') as any;
        console.log("Notifactions : ", notification);
        setNotification(notification);
    }

    useEffect(() => {
        loadNotification();
        axiosInstance.get(ServerRoutes.userRoutes.requests()).then((data) => {
            setRequests(data.userRequests);
        }).catch(e => console.log(e));
    }, []);


    interface NotificationProps {
        userData: { [key: string]: any },
        type: string,
        contentId: String,
        contentType: String
    }

    interface Props {
        item: NotificationProps
    }

    const typeMatchTemplates = {
        follow: `started following you`,
        liked: 'liked your post',
        comment: 'commented on your post',
    };

    const getMessage = (type: string) => {
        const template = typeMatchTemplates[type];
        return template
    }
    const handleRequest = (action: string, id: string) => {
        axiosInstance.post(ServerRoutes.userRoutes.requests(`${action}?id=${id}`));
        setRequests(prev => prev.filter(req => req._id !== id));
    }

    return (
        <div>
            <h1 style={{ fontSize: "1.5rem", padding: "var(--padding-medium)" }}>Notifications</h1>
            <ConditionalRendererWithoutDefault
                condition={context.userData.accountVisibility == 'private' && requests.length > 0}
                component={<Holder style={{ padding: "var(--padding-medium)" }}>
                    <h2 style={{ fontSize: "1rem" }}>User Requests</h2>
                    {requests.map((value: any, index) =>
                        <GenericHeader onClick={() => navigate(`/dashboard/profile?user=${value.username}-${value._id}`)}
                            key={index} imagePath={value.profilePicture}
                            clickType="text"
                            headText={value.username}
                            showIcon={false}
                            decorate={false}
                            hintText="wants to follow you">
                            <AccentButton onClick={() => handleRequest('accept', value._id)} text="Accept" />
                            <BasicButton onClick={() => handleRequest('reject', value._id)} text="Reject" />

                        </GenericHeader>)}
                </Holder>}
            />
            <Holder style={{ flexDirection: "column-reverse" }}>
                {
                    notifications?.map((value: any, index) =>
                        <Holder style={{ gap: "var(--gap-medium)", padding: "var(--padding-small)" }} onClick={value.contentId ? () => navigate(`/dashboard/post/${value.contentId}`) : undefined}>
                            <GenericHeader
                                style={{ padding: "var(--padding-small)", borderBottom: "1px solid var(--color-shadow)" }}
                                key={index}
                                headText={value.userData.username}
                                clickType="text"
                                rightText={getMessage(value.type)}
                                content={value.text}
                                onClick={() => navigate(`/dashboard/profile?user=${value.userData.username}-${value.userData._id}`)}
                                decorate={false}
                                imagePath={value.userData.profilePicture}
                                showIcon={false}
                            >


                                {value.media && <img style={{ width: "var(--icon-medium)", height: "var(--icon-medium)" }} src={!value.media.includes('video') ? value.media : '/icons/app_icon.png'} />}


                            </GenericHeader>
                        </Holder>
                    )
                }
            </Holder>



        </div>
    )
}