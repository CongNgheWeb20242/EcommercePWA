import React from 'react';
import axios from 'axios';
import { Order } from './order';

interface PaymentButtonProps {
  order: Order;
  onError?: (error: Error) => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ order, onError }) => {
  const handlePayment = async (): Promise<void> => {
    try {
      const response = await axios.post<{
        code: string;
        data: string;
      }>('/api/payment/create_vnpay_url', { order });

      if (response.data.code === '00') {
        window.location.href = response.data.data;
      } else {
        throw new Error('Payment URL creation failed');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      if (error instanceof Error && onError) {
        onError(error);
      }
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      type="button"
    >
      Thanh toán với VNPay
    </button>
  );
};

export default PaymentButton;