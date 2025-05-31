import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reset_password } from '@/services/auth/authService';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // hoặc dùng FontAwesome

const ResetPasswordPage = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError('Liên kết đặt lại mật khẩu không hợp lệ');
            const timer = setTimeout(() => navigate('/user/login'), 3000);
            return () => clearTimeout(timer);
        }
    }, [token, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) return;

        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }

        try {
            setIsLoading(true);
            const error = await reset_password({ token, password });

            if (error) {
                setError(error);
            } else {
                setSuccess(true);
                setTimeout(() => navigate('/user/login'), 2000);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi đổi mật khẩu');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="h-[700px] bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                    <div className="text-red-600 mb-4">{error}</div>
                    <div className="text-gray-600">Đang chuyển hướng về trang đăng nhập...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[700px] bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Đặt lại mật khẩu</h2>

                {success ? (
                    <div className="text-green-600 text-center">
                        Đổi mật khẩu thành công! Đang chuyển hướng...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 relative">
                            <label className="block text-gray-700 mb-2">Mật khẩu mới</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-gray-500"
                                tabIndex={-1}
                                onClick={() => setShowPassword((v) => !v)}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="w-5 h-5" />
                                ) : (
                                    <EyeIcon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        <div className="mb-6 relative">
                            <label className="block text-gray-700 mb-2">Xác nhận mật khẩu</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-gray-500"
                                tabIndex={-1}
                                onClick={() => setShowConfirmPassword((v) => !v)}
                            >
                                {showConfirmPassword ? (
                                    <EyeSlashIcon className="w-5 h-5" />
                                ) : (
                                    <EyeIcon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Đang xử lý...
                                </>
                            ) : (
                                'Đổi mật khẩu'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
