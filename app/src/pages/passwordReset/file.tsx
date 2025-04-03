import { toast } from 'react-toastify';
import './style.css';
import axiosInstance from '../../helpers/axiosModified';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Forgetpassword() {
    const [email, setEmail] = useState("");
    const [params] = useSearchParams();
    const [newPassword,setNewPassword]=useState("");
    
    const token = useMemo(() => params.get('token'), [params]);

    const handleClick = () => {
        axiosInstance.post('/reset', { email: email })
            .then(() => toast.success("Check your email for further instructions"))
            .catch(err => toast.error("Error sending reset email"));
    };


    const changePassword=()=>{
        axiosInstance.post('/changepassword',{token:token,password:newPassword});
    }

    return (
        <div className="reset-password-page">
            {!token ? (
                <div className="reset-password">
                    <span className="text-dark">Please enter your registered email below</span>
                    <input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Enter your email" 
                        className="input"
                    />
                    <button onClick={handleClick} className='btn accent'>Submit</button>
                </div>
            ) : (
                <div className='reset-password'>
                    <input className='input' onChange={(e)=>setNewPassword(e.target.value)} value={newPassword} placeholder='Please enter your new password'/>
                    <button onClick={changePassword} className='btn accent'>Change Password</button>
                </div>
            )}
        </div>
    );
}
