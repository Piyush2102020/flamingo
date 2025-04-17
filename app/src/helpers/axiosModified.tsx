import axios from "axios";
import { toast } from "react-toastify";


console.log("Base Url : ",import.meta.env.VITE_BASE_URL);

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: { "Content-Type": "application/json" }
});

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle responses & errors
axiosInstance.interceptors.response.use(
    (response) => {
        toast.info(response.data.message);
        return response.data.data;
    },
    (error) => {
        if (error.response) {
            
            const message = error.response.data?.message || "An error occurred";

            if (error.response.status === 401) {
                toast.error(message);
                
                localStorage.removeItem("token");
                sessionStorage.clear();
                
                window.location.replace("/auth"); 
            } else {
                toast.error(message);
            }
        } else {
            toast.error("Network error. Please try again.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
