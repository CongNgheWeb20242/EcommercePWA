import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "@/store/userStore";
import { forget_password } from "@/services/auth/authService";

const ForgotPasswordForm: React.FC = () => {
    const navigate = useNavigate();
    const { error, setError, loading, setLoading } = userStore();
    const [email, setEmail] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg("");
        setError("");
        setLoading(true);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Vui lòng nhập đúng định dạng email.");
            setLoading(false);
            return;
        }
        const prop = {
            email: email
        }
        const result = await forget_password(prop);
        if (result) {
            setSuccessMsg("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn!");
        } else {
            setError(result || "Có lỗi xảy ra. Vui lòng thử lại.");
        }
        setLoading(false);
    };

    return (
        <div className="flex h-[700px] items-center justify-center bg-gray-100">
            <div className="bg-white w-[400px] p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Quên mật khẩu</h1>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}
                {successMsg && (
                    <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md text-sm">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Nhập email để lấy lại mật khẩu
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="youremail@gmail.com"
                            className="w-full border rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition mb-4"
                        disabled={loading}
                    >
                        {loading ? "Đang gửi..." : "Gửi email đặt lại mật khẩu"}
                    </button>
                </form>

                <button
                    className="w-full bg-gray-100 py-2 rounded-md font-medium hover:bg-gray-200 transition"
                    onClick={() => navigate("/user/login")}
                >
                    Quay lại đăng nhập
                </button>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
