// frontend/src/test/PaymentReturn.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type PaymentStatus = 'processing' | 'success' | 'failed';

interface PaymentResponse {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
  [key: string]: string;
}

const getPaymentMessage = (responseCode: string): string => {
  const messages: { [key: string]: string } = {
    '00': 'Giao dịch thành công',
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
    '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking',
    '10': 'Xác thực thông tin thẻ/tài khoản không đúng',
    '11': 'Đã hết hạn chờ thanh toán',
    '12': 'Thẻ/Tài khoản bị khóa',
    '13': 'Sai mật khẩu xác thực (OTP)',
    '24': 'Giao dịch không thành công do khách hàng hủy giao dịch',
    '51': 'Tài khoản không đủ số dư',
    '65': 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày',
    '75': 'Ngân hàng đang bảo trì',
    '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định',
    '99': 'Lỗi không xác định'
  };
  return messages[responseCode] || 'Lỗi không xác định';
};

const PaymentReturn: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('processing');
  const [message, setMessage] = useState<string>('');
  const [details, setDetails] = useState<PaymentResponse | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const responseCode = queryParams.get('vnp_ResponseCode');
    const transactionStatus = queryParams.get('vnp_TransactionStatus');

    // Convert query params to PaymentResponse object
    const paymentResponse: PaymentResponse = Array.from(queryParams.entries()).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value,
      }),
      {} as PaymentResponse
    );

    setDetails(paymentResponse);

    if (responseCode === '00' && transactionStatus === '00') {
      setPaymentStatus('success');
    } else {
      setPaymentStatus('failed');
    }

    setMessage(getPaymentMessage(responseCode || '99'));
  }, [location]);

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Kết quả thanh toán</h2>
      
      {paymentStatus === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Thanh toán thành công!</strong>
          <p className="mt-2">{message}</p>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Thanh toán thất bại!</strong>
          <p className="mt-2">{message}</p>
        </div>
      )}

      {details && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="text-lg font-semibold mb-2">Chi tiết giao dịch:</h3>
          <div className="space-y-2 text-sm">
            <p>Mã giao dịch: {details.vnp_TransactionNo}</p>
            <p>Số tiền: {parseInt(details.vnp_Amount) / 100} VNĐ</p>
            <p>Ngân hàng: {details.vnp_BankCode}</p>
            <p>Thời gian: {details.vnp_PayDate}</p>
            <p>Nội dung: {details.vnp_OrderInfo}</p>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
      >
        Quay lại trang chủ
      </button>
    </div>
  );
};

export default PaymentReturn;