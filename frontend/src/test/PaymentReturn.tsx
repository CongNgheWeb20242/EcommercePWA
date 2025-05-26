import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentReturn = () => {
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');
  const location = useLocation();

  useEffect(() => {
    const handlePaymentReturn = async () => {
      try {
        // Lấy query parameters từ URL
        const query = new URLSearchParams(location.search);
        
        // Gọi API để xác nhận thanh toán
        const response = await fetch('https://ecommercepwa-be.onrender.com/api/payment/vnpay_return?' + query.toString());
        const data = await response.json();
        
        if (data.code === '00') {
          setPaymentStatus('success');
          setMessage('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
        } else {
          setPaymentStatus('error');
          setMessage(`Thanh toán thất bại: ${data.message || 'Có lỗi xảy ra'}`);
        }
      } catch (error) {
        console.error('Error handling payment return:', error);
        setPaymentStatus('error');
        setMessage('Có lỗi xảy ra khi xử lý kết quả thanh toán.');
      }
    };

    handlePaymentReturn();
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          {paymentStatus === 'loading' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          )}
          
          {paymentStatus === 'success' && (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          
          {paymentStatus === 'error' && (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          
          <h2 className="text-2xl font-bold mb-4">
            {paymentStatus === 'loading' ? 'Đang xử lý' : 
             paymentStatus === 'success' ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
          </h2>
          
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex justify-center">
            <Link 
              to="/" 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Trở về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReturn; 