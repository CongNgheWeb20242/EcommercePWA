import { userStore } from '@/store/userStore';
import { User } from '@/types/User';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const { setError, setUser } = userStore();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const token = searchParams.get('token');
        let redirectTimer: NodeJS.Timeout;

        const handleSuccess = () => {
            setStatus('success');
            redirectTimer = setTimeout(() => navigate('/home'), 1800);
        };

        const handleError = (msg: string) => {
            setStatus('error');
            setError(msg);
            redirectTimer = setTimeout(() => navigate('/user/login'), 1800);
        };

        setTimeout(() => {
            if (token) {
                try {
                    const user: User = jwtDecode<User>(token);
                    if (!user || !user._id || !user.email) {
                        handleError('Token không hợp lệ');
                        return;
                    }
                    setUser(user);
                    localStorage.setItem('token', token);
                    handleSuccess();
                } catch (err) {
                    handleError('Token không hợp lệ');
                }
            } else {
                handleError('Đăng nhập thất bại');
            }
        }, 1200);

        return () => {
            if (redirectTimer) clearTimeout(redirectTimer);
        };
    }, [searchParams, navigate, setError, setUser]);

    let message = 'Đang xử lý đăng nhập...';
    if (status === 'success') message = 'Đăng nhập thành công, đang chuyển hướng...';
    if (status === 'error') message = 'Đăng nhập thất bại, đang chuyển hướng...';

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-white">
            <div className="flex items-center space-x-2 mb-4">
                <span className="dot-bounce bg-blue-500"></span>
                <span className="dot-bounce bg-blue-400 animation-delay-200"></span>
                <span className="dot-bounce bg-blue-300 animation-delay-400"></span>
            </div>
            <span className={`text-lg font-medium ${status === 'error' ? 'text-red-600' : 'text-gray-700'}`}>
                {message}
            </span>
            {/* Custom CSS for dot bounce */}
            <style>
                {`
                .dot-bounce {
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    margin: 0 4px;
                    animation: bounce 0.8s infinite alternate;
                }
                .animation-delay-200 { animation-delay: 0.2s; }
                .animation-delay-400 { animation-delay: 0.4s; }
                @keyframes bounce {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-16px); }
                }
                `}
            </style>
        </div>
    );
};

export default OAuthSuccess;
