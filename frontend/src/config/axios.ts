import axios from "axios";
import { useUserStore } from "@/store/userStore";

// https://axios-http.com/docs/instance
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',

    // Cho phép gửi cookie, token hoặc thông tin xác thực (credentials) cùng với yêu cầu HTTP.
    /*
        Điều này cần thiết nếu:
            Backend yêu cầu xác thực thông qua cookie hoặc session.
            Backend được cấu hình với CORS (Cross-Origin Resource Sharing) và yêu cầu xác thực từ domain khác.
    */
    withCredentials: true,
});

// Thêm interceptor để gửi token xác thực với mỗi request
axiosInstance.interceptors.request.use(
    (config) => {
        // Lấy user từ store
        const user = useUserStore.getState().user;
        
        // Nếu có user và token, thêm vào header
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);