import { toast } from 'react-toastify';
import './style.css';
import axiosInstance from '../../helpers/axiosModified';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BasicInputField } from '../../newComponents/Clickables/fields/file';
import { AccentButton, BasicButton } from '../../newComponents/Clickables/buttons/file';
import { Holder } from '../../newComponents/Generics/GenericHolders/file';
import { ConditionalRendererWithDefault } from '../../newComponents/Generics/GenericConditionlRender/file';

export default function Forgetpassword() {
    const [email, setEmail] = useState("");
    const [params] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");

    const token: string | null = useMemo(() => params.get('token'), [params]);

    const checkToken = (token: string | null) => {
        return !!(token && token.trim());
    };


    const handleClick = async() => {
        await axiosInstance.post('/reset', { email: email });
    };


    const changePassword = () => {
        axiosInstance.post('/changepassword', { token: token, password: newPassword });
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
