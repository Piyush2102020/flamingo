import axiosInstance from '../../helpers/axiosModified';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BasicInputField } from '../../newComponents/Clickables/fields/file';
import { AccentButton} from '../../newComponents/Clickables/buttons/file';
import { Holder } from '../../newComponents/Generics/GenericHolders/file';
import { ConditionalRendererWithDefault } from '../../newComponents/Generics/GenericConditionlRender/file';
import { ServerRoutes } from '../../helpers/serverRoutes';

export default function Forgetpassword() {
    // ------------------------------ State Variable ------------------------------
    
    const [email, setEmail] = useState("");
    const [params] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const token: string | null = useMemo(() => params.get('token'), [params]);



    // ------------------------------ Helper Functions ------------------------------
    
    
    
    const checkToken = (token: string | null) => {
        return !!(token && token.trim());
    };


    
    const handleClick = async() => {
        await axiosInstance.post(ServerRoutes.auth.resetPassword(), { email: email });
    };


    const changePassword = () => {
        axiosInstance.post(ServerRoutes.auth.changePassword(), { token: token, password: newPassword });
    }



    return (
        <div className="reset-password-page">

            <ConditionalRendererWithDefault
                condition={checkToken(token)}
                component={(
                    <Holder>
                        <BasicInputField onChange={(e) => setNewPassword(e.target.value)} value={newPassword} placeholder="Please enter your new password" />
                        <AccentButton onClick={changePassword} text="Change Password" />
                    </Holder>
                )}
                defaultComponent={(
                    <Holder>
                        <span className="text-dark">Please enter your registered email below</span>
                        <BasicInputField value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                        <AccentButton onClick={handleClick} text="Submit" />
                    </Holder>
                )}
            />

        </div>
    );
}
