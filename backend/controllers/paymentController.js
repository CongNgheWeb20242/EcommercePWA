import crypto from 'crypto';
import querystring from 'qs';
import dotenv from 'dotenv';

dotenv.config();

const tmnCode = process.env.VNPAY_TMN_CODE;
const secretKey = process.env.VNPAY_HASH_SECRET;
const vnpUrl = process.env.VNPAY_URL;
const returnUrl = process.env.VNPAY_RETURN_URL;

function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj);
  
  // Sắp xếp các key
  keys.sort();
  
  // Tạo object mới với các key đã sắp xếp
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });

  return sorted;
}

const createPaymentUrl = async (req, res) => {
  try {
    const order = req.body.order;
    if (!order || !order.totalPrice) {
      throw new Error('Invalid order data');
    }

    const ipAddr = '127.0.0.1'; // Sử dụng IP cố định để tránh vấn đề với IPv6

    const date = new Date();
    const createDate = 
      date.getFullYear().toString() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2) +
      ('0' + date.getHours()).slice(-2) +
      ('0' + date.getMinutes()).slice(-2) +
      ('0' + date.getSeconds()).slice(-2);

    const orderId = `${Date.now()}`; // Tạo mã đơn hàng unique
    const amount = Math.round(order.totalPrice * 100);
    const orderInfo = `THANHTOAN${orderId}`; // Không dấu, không khoảng trắng

    let vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: '250000',
      vnp_Amount: amount,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate
    };

    // Tạo ngày hết hạn = 15 phút sau
    const expireDate = new Date(date.getTime() + 15 * 60 * 1000);
    const expireDateString = 
      expireDate.getFullYear().toString() +
      ('0' + (expireDate.getMonth() + 1)).slice(-2) +
      ('0' + expireDate.getDate()).slice(-2) +
      ('0' + expireDate.getHours()).slice(-2) +
      ('0' + expireDate.getMinutes()).slice(-2) +
      ('0' + expireDate.getSeconds()).slice(-2);
    
    vnpParams['vnp_ExpireDate'] = expireDateString;

    // Sắp xếp các tham số theo key
    vnpParams = sortObject(vnpParams);

    // Tạo chuỗi ký tự cần ký
    const signData = querystring.stringify(vnpParams, { encode: false });
    
    // Tạo chữ ký
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    // Thêm chữ ký vào params
    vnpParams['vnp_SecureHash'] = signed;

    // Tạo URL thanh toán
    const paymentUrl = `${vnpUrl}?${querystring.stringify(vnpParams, { encode: true })}`;

    // Log để debug
    console.log('Payment URL created:', {
      amount,
      orderId,
      createDate,
      expireDate: expireDateString,
      signData,
      secureHash: signed
    });

    res.json({
      code: '00',
      data: paymentUrl
    });

  } catch (error) {
    console.error('Payment Error:', error);
    res.status(500).json({
      code: '99',
      message: 'Lỗi tạo URL thanh toán',
      error: error.message
    });
  }
};

const vnpayIPN = async (req, res) => {
  try {
    const vnpParams = req.query;
    const secureHash = vnpParams['vnp_SecureHash'];

    // Xóa các trường không cần thiết
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    // Sắp xếp các tham số theo key
    const sortedParams = sortObject(vnpParams);
    
    // Tạo chuỗi ký tự cần kiểm tra
    const signData = querystring.stringify(sortedParams, { encode: false });
    
    // Tạo chữ ký để so sánh
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const orderId = vnpParams['vnp_TxnRef'];
      const rspCode = vnpParams['vnp_ResponseCode'];

      // Cập nhật kết quả thanh toán
      if (rspCode === '00') {
        // Thanh toán thành công
        return res.status(200).json({ RspCode: '00', Message: 'Success' });
      } else {
        // Thanh toán thất bại
        return res.status(200).json({ RspCode: rspCode, Message: 'Failed' });
      }
    } else {
      return res.status(200).json({ RspCode: '97', Message: 'Invalid Signature' });
    }
  } catch (error) {
    return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
  }
};

const vnpayReturn = async (req, res) => {
  try {
    const vnpParams = req.query;
    const secureHash = vnpParams['vnp_SecureHash'];

    // Xóa các trường không cần thiết
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    // Sắp xếp các tham số theo key
    const sortedParams = sortObject(vnpParams);
    
    // Tạo chuỗi ký tự cần kiểm tra
    const signData = querystring.stringify(sortedParams, { encode: false });
    
    // Tạo chữ ký để so sánh
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      return res.json({
        code: vnpParams['vnp_ResponseCode'],
        message: getResponseMessage(vnpParams['vnp_ResponseCode']),
        data: vnpParams
      });
    } else {
      return res.json({
        code: '97',
        message: 'Invalid Signature',
        data: null
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: '99',
      message: 'Unknown error',
      data: null
    });
  }
};

function getResponseMessage(responseCode) {
  const messages = {
    '00': 'Giao dịch thành công',
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
    '09': 'Giao dịch không thành công do: Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking',
    '10': 'Xác thực thông tin thẻ/tài khoản không đúng',
    '11': 'Đã hết hạn chờ thanh toán',
    '12': 'Thẻ/Tài khoản bị khóa',
    '13': 'Sai mật khẩu xác thực (OTP)',
    '24': 'Giao dịch không thành công do khách hàng hủy giao dịch',
    '51': 'Tài khoản không đủ số dư',
    '65': 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày',
    '75': 'Ngân hàng đang bảo trì',
    '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định',
    '99': 'Các lỗi khác'
  };
  return messages[responseCode] || 'Lỗi không xác định';
}

export { createPaymentUrl, vnpayIPN, vnpayReturn };