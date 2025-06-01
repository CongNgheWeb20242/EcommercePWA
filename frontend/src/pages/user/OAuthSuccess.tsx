import { userStore } from '@/store/userStore';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const { setError } = userStore();
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');
        const timer = setTimeout(() => {
            if (token) {
                localStorage.setItem('token', token);
                navigate('/home');
            } else {
                setShowError(true);
                setError('Đăng nhập thất bại');
                setTimeout(() => navigate('/user/login'), 1500);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [searchParams, navigate, setError]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-white">
            <div className="flex items-center space-x-2 mb-4">
                <span className="dot-bounce bg-blue-500"></span>
                <span className="dot-bounce bg-blue-400 animation-delay-200"></span>
                <span className="dot-bounce bg-blue-300 animation-delay-400"></span>
            </div>
            <span className="text-gray-700 text-lg font-medium">
                {showError ? 'Đăng nhập thất bại, đang chuyển hướng...' : 'Đang xử lý đăng nhập'}
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
