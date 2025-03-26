import axios from "axios";

// https://axios-http.com/docs/instance
export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",

    // Cho phép gửi cookie, token hoặc thông tin xác thực (credentials) cùng với yêu cầu HTTP.
    /*
        Điều này cần thiết nếu:
            Backend yêu cầu xác thực thông qua cookie hoặc session.
            Backend được cấu hình với CORS (Cross-Origin Resource Sharing) và yêu cầu xác thực từ domain khác.
    */
    withCredentials: true,
});