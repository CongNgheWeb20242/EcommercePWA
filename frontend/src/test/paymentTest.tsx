// components/PaymentButton.js
import axios from 'axios';

const PaymentButton = ({ order }) => {
    const handlePayment = async () => {
        try {
            const response = await axios.post('/api/payment/create_vnpay_url', { order });
            if (response.data.code === '00') {
                // Chuyển hướng đến trang thanh toán VNPay
                window.location.href = response.data.data;
            }
        } catch (error) {
            console.error('Payment Error:', error);
            // Hiển thị thông báo lỗi
        }
    };

    return (
        <button onClick={handlePayment}>
            Thanh toán với VNPay
        </button>
    );
};

// pages/PaymentReturn.js
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentReturn = () => {
    const [paymentStatus, setPaymentStatus] = useState('processing');
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const responseCode = queryParams.get('vnp_ResponseCode');

        if (responseCode === '00') {
            setPaymentStatus('success');
        } else {
            setPaymentStatus('failed');
        }
    }, [location]);

    return (
        <div>
            <h2>Kết quả thanh toán</h2>
            {paymentStatus === 'success' && (
                <div className="success">
                    Thanh toán thành công!
                </div>
            )}
            {paymentStatus === 'failed' && (
                <div className="error">
                    Thanh toán thất bại!
                </div>
            )}
        </div>
    );
};