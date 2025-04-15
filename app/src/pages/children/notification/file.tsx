import { act, useEffect, useState } from "react"
import axiosInstance from "../../../helpers/axiosModified";
import { GenericHeader } from "../../../newComponents/Generics/GenericHeader/file";
import { useSelector } from "react-redux";
import { RootState } from "../../../helpers/store";
import { Holder } from "../../../newComponents/Generics/GenericHolders/file";
import { ConditionalRendererWithoutDefault } from "../../../newComponents/Generics/GenericConditionlRender/file";
import { AccentButton, BasicButton } from "../../../newComponents/Clickables/buttons/file";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/header/file";
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
        axiosInstance.get('/requests').then((data) => {
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
        axiosInstance.post(`/requests/${action}?id=${id}`);
    }

    return (
        <div>
            <h1>Notifications</h1>
            <ConditionalRendererWithoutDefault
                condition={context.userData.accountVisibility == 'private' && requests.length > 0}
                component={<Holder>
                    <h2>User Requests</h2>
                    {requests.map((value: any, index) => <GenericHeader onClick={() => navigate(`/dashboard/profile?user=${value.username}-${value._id}`)} key={index} imagePath={value.profilePicture} clickType="text" headText={value.username} showIcon={false} decorate={false} hintText="wants to follow you">
                        <AccentButton onClick={() => handleRequest('accept', value._id)} text="Accept" />
                        <BasicButton onClick={() => handleRequest('reject', value._id)} text="Reject" />
                    </GenericHeader>)}
                </Holder>}
            />
            <Holder style={{ flexDirection: "column-reverse" }}>
                {
                    notifications?.map((value: any, index) =>
                        <Holder onClick={value.contentId?()=>navigate(`/dashboard/post/${value.contentId}`):undefined}>
                            <GenericHeader
                                style={{ margin: "var(--margin-medium)", justifyContent: "center", alignItems: "center" }}
                                key={index}
                                headText={value.userData.username}
                                clickType="text"
                                hintText={getMessage(value.type)}
                                onClick={() => navigate(`/dashboard/profile?user=${value.userData.username}-${value.userData._id}`)}
                                decorate={false}
                                imagePath={value.userData.profilePicture}
                            />
                        </Holder>
                    )
                }
            </Holder>



        </div>
    )
}