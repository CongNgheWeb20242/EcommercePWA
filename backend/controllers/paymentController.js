import dotenv from 'dotenv';
import { createOrder } from '../services/paymentService.js';

dotenv.config();

import {
  VNPay,
  ignoreLogger,
  ProductCode,
  IpnFailChecksum,
  IpnOrderNotFound,
  IpnInvalidAmount,
  InpOrderAlreadyConfirmed,
  IpnUnknownError,
  IpnSuccess,
} from 'vnpay';

// createPaymentUrl, vnpayIPN, vnpayReturn
const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE,
  secureSecret: process.env.VNPAY_SECRET_KEY,
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true
  hashAlgorithm: 'SHA512', // tùy chọn

  /**
   * Bật/tắt ghi log
   * Nếu enableLog là false, loggerFn sẽ không được sử dụng trong bất kỳ phương thức nào
   */
  enableLog: true, // tùy chọn

  /**
   * Hàm `loggerFn` sẽ được gọi để ghi log khi enableLog là true
   * Mặc định, loggerFn sẽ ghi log ra console
   * Bạn có thể cung cấp một hàm khác nếu muốn ghi log vào nơi khác
   *
   * `ignoreLogger` là một hàm không làm gì cả
   */
  loggerFn: ignoreLogger, // tùy chọn

  /**
   * Tùy chỉnh các đường dẫn API của VNPay
   * Thường không cần thay đổi trừ khi:
   * - VNPay cập nhật đường dẫn của họ
   * - Có sự khác biệt giữa môi trường sandbox và production
   */
  endpoints: {
    paymentEndpoint: 'paymentv2/vpcpay.html',
    queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
    getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
  }, // tùy chọn
});

export const createPaymentUrl = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    // Tạo đơn hàng
    const order = await createOrder(req.body); // Tự triển khai

    // Nếu người dùng chọn thanh toán khi nhận hàng
    if (paymentMethod === 'cod') {
      return res.json({
        success: true,
        message: 'Đơn hàng đã được tạo. Thanh toán khi nhận hàng.',
        order,
      });
    }

    // Nếu là thanh toán VNPay
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: order.amount,
      vnp_IpAddr:
        req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip,
      vnp_TxnRef: order.order_id,
      vnp_OrderInfo: `Thanh toan don hang ${order.order_id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: 'https://ecommercepwa-be.onrender.com/api/payment/vnpay_return', // Frontend - Thay sau
      vnp_Locale: 'vn',
    });

    return res.json({
      success: true,
      paymentUrl,
      order,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng',
      error: error.message,
    });
  }
};

// Đoạn này xử lý với backend, xử lý sau cùng
export const vnpayIPN = async (req, res) => {
  try {
    console.log('📥 Nhận IPN từ VNPay:', req.query);

    const verify = vnpay.verifyIpnCall(req.query);
    console.log('✅ Kết quả verify:', verify);

    if (!verify.isVerified) {
      console.log('❌ Sai checksum');
      return res.json(IpnFailChecksum);
    }

    if (!verify.isSuccess) {
      console.log('⚠️ Giao dịch không thành công từ VNPay');
      return res.json(IpnUnknownError);
    }

    // Tìm đơn hàng trong cơ sở dữ liệu
    const foundOrder = await findOrderById(verify.vnp_TxnRef);
    console.log('🔎 Đơn hàng tìm thấy:', foundOrder);

    if (!foundOrder) {
      console.log('❌ Không tìm thấy đơn hàng');
      return res.json(IpnOrderNotFound);
    }

    if (verify.vnp_TxnRef !== foundOrder.order_id) {
      console.log(
        '❌ Mã đơn hàng không khớp. Gửi:',
        verify.vnp_TxnRef,
        ' DB:',
        foundOrder.order_id
      );
      return res.json(IpnOrderNotFound);
    }

    if (verify.vnp_Amount !== foundOrder.amount) {
      console.log(
        '❌ Số tiền không khớp. Gửi:',
        verify.vnp_Amount,
        ' DB:',
        foundOrder.amount
      );
      return res.json(IpnInvalidAmount);
    }

    if (foundOrder.status === 'completed') {
      console.log('ℹ️ Đơn hàng đã được xác nhận từ trước');
      return res.json(InpOrderAlreadyConfirmed);
    }

    // Cập nhật trạng thái đơn hàng
    await updateOrderStatus(foundOrder.order_id, 'completed');
    console.log('✅ Cập nhật đơn hàng thành công:', foundOrder.order_id);

    return res.json(IpnSuccess);
  } catch (error) {
    console.error('🔥 Lỗi xảy ra trong xử lý IPN:', error);
    return res.json(IpnUnknownError);
  }
};

// Return khi client tiến hành thanh toán xong (Bất kể kết quả)
export const vnpayReturn = async (req, res) => {
  let verify;
  try {
    verify = vnpay.verifyReturnUrl(req.query); // Xác minh chữ ký
    if (!verify.isVerified) {
      return res.send('Xác thực tính toàn vẹn dữ liệu thất bại');
    }
    if (!verify.isSuccess) {
      return res.send('Đơn hàng thanh toán thất bại');
    }
  } catch (error) {
    return res.send('Dữ liệu không hợp lệ');
  }

  return res.send('Thanh toán thành công!');
};