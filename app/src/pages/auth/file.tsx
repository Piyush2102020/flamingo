import React, { useState } from "react";
import axiosInstance from "../../helpers/axiosModified";
import { toast } from "react-toastify";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { BasicInputField } from "../../newComponents/Clickables/fields/file";
import { ConditionalRendererWithoutDefault } from "../../newComponents/Generics/GenericConditionlRender/file";
import { AccentButton } from "../../newComponents/Clickables/buttons/file";
import { ClickablePara } from "../../newComponents/Clickables/text/file";
import { AuthFormData } from "../../helpers/interfaces";
import { ServerRoutes } from "../../helpers/serverRoutes";




export default function Auth() {
    // ------------------------------ State Variables Decleration ------------------------------

    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [formData, setData] = useState<AuthFormData>({
        name: "",
        email: "",
        username: "",
        password: ""
    });



    // ------------------------------ Helper functions for form submission and changes ------------------------------


    const handleFormDataChange = (element: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...formData, [element.target.name]: element.target.value });
    };

    const isEmpty = (value: string) => {
        return !value.trim();
    };

    const handleFormSubmit = () => {
        let type = isLogin ? "login" : "create";
        const keys = Object.keys(formData) as (keyof AuthFormData)[];
        const requiredFields = isLogin ? ["email", "password"] : keys;
        for (let i = 0; i < requiredFields.length; i++) {
            if (isEmpty(formData[requiredFields[i] as keyof AuthFormData])) {
                toast.error(`${requiredFields[i]} can't be empty`);
                return;
            }
        }

        axiosInstance.post(ServerRoutes.auth.authentication(type), formData)
            .then((response: any) => {
                localStorage.setItem("token", response.token);
                setTimeout(() => {
                    window.location.replace("/dashboard");
                }, 1500);
            })
            .catch((e) => toast.error(e.response?.data?.message || "An error occurred"));
    };

    const handleSuccess = (response: any) => {
        const token = response.credential;
        const userData = jwtDecode(token) as any;
        setData(formData => ({ ...formData, email: userData.email, name: userData.name }))

    }


    // ------------------------------ Return JSX ------------------------------
    return (
        <div className="auth-page">
            <div className="auth-form">
                <h1 className="appname">{import.meta.env.VITE_APP_NAME}</h1>
                <ConditionalRendererWithoutDefault condition={!isLogin} component={<>
                    <BasicInputField name="name" onChange={handleFormDataChange} placeholder="Name" value={formData.name} />
                    <BasicInputField name="username" onChange={handleFormDataChange} placeholder="Username" value={formData.username} />
                </>} />

                <BasicInputField name="email" onChange={handleFormDataChange} placeholder="Email" value={formData.email} />
                <BasicInputField name="password" onChange={handleFormDataChange} placeholder="Password" value={formData.password} />

                <ConditionalRendererWithoutDefault condition={navigator.onLine} component={<GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                    <GoogleLogin text={isLogin ? "continue_with" : "signup_with"} theme="outline" onSuccess={handleSuccess} onError={() => { toast.error("Oauth Error") }}></GoogleLogin>
                </GoogleOAuthProvider>} />

                <AccentButton onClick={handleFormSubmit} text={isLogin ? "Login" : "Create Account"} />

                <ClickablePara text={isLogin ? "No Account? Click here to create one" : "Already have an account? Login here"} onClick={() => setIsLogin(!isLogin)} />

                <ConditionalRendererWithoutDefault condition={isLogin} component={<span onClick={() => { navigate('/auth/forgetpassword') }} className="text-light" style={{ alignSelf: "flex-end" }}>Forgot Password?</span>} />

            </div>
        </div>
    );
}
