import React, { useState } from "react";
import axiosInstance from "../../helpers/axiosModified";
import { toast } from "react-toastify";
import './style.css';
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";



interface AuthFormData {
    name: string;
    email: string;
    username: string;
    password: string;
}

export default function Auth() {
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setData] = useState<AuthFormData>({
        name: "",
        email: "",
        username: "",
        password: ""
    });


    const navigate=useNavigate();

    const handleChange = (element: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...formData, [element.target.name]: element.target.value });
    };

    const isEmpty = (value: string) => {
        return !value.trim(); 
    };

    const handleSubmit = () => {
        let type = isLogin ? "login" : "create";
        const keys = Object.keys(formData) as (keyof AuthFormData)[];
    
        const requiredFields = isLogin ? ["email", "password"] : keys;
    
        for (let i = 0; i < requiredFields.length; i++) {
            if (isEmpty(formData[requiredFields[i] as keyof AuthFormData])) {
                toast.error(`${requiredFields[i]} can't be empty`);
                return;
            }
        }
    
        axiosInstance.post(`/auth/${type}`, formData)
            .then((response: any) => {
                localStorage.setItem("token", response.token);
                setTimeout(() => {
                    window.location.replace("/dashboard");
                }, 1500);
            })
            .catch((e) => toast.error(e.response?.data?.message || "An error occurred"));
    };
    
    const handleSuccess=(response:any)=>{
        const token=response.credential;
        const userData=jwtDecode(token) as any;
        setData(formData=>{formData.name=userData.name;
            formData.email=userData.email;
            return formData
        })
        
    }
    return (
        <div className="auth-page">
            <div className="auth-form">
                <h1 className="appname">{import.meta.env.VITE_APP_NAME}</h1>
                {!isLogin && (
                    <>
                        <input className="input" onChange={handleChange} placeholder="Name" name="name" value={formData.name} />
                        <input className="input" onChange={handleChange} placeholder="Username" name="username" value={formData.username} />
                    </>
                )}
                <input className="input" onChange={handleChange} placeholder="Email" name="email" value={formData.email} />
                <input className="input" onChange={handleChange} placeholder="Password" name="password" value={formData.password} />
                {navigator.onLine&&
                <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                <GoogleLogin text={isLogin?"continue_with":"signup_with"}  theme="filled_blue"  onSuccess={handleSuccess} onError={()=>{toast.error("Oauth Error")}}></GoogleLogin>
            </GoogleOAuthProvider>
                }
                
                <button className="btn accent" onClick={handleSubmit}>{isLogin ? "Login" : "Create Account"}</button>
                <p onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "No Account? Click here to create one" : "Already have an account? Login here"}<br/>
                    
                </p>
                {isLogin&& <span onClick={()=>{navigate('/auth/forgetpassword')}} className="text-light" style={{alignSelf:"flex-end"}}>Forgot Password?</span>}
            </div>
        </div>
    );
}
