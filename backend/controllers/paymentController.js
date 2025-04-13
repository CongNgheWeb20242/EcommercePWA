import crypto from 'crypto';
import qs from 'qs';
import moment from 'moment';

const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
const vnp_Url = process.env.VNPAY_URL;
const vnp_ReturnUrl = process.env.VNPAY_RETURN_URL;
const vnp_QueryUrl = process.env.VNPAY_QUERY_URL;

const createPaymentUrl = async (req, res) => {
  try {
    const order = req.body.order;

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    // Order info
    const orderId = `${Date.now()}_${order._id}`;
    const orderInfo = `Thanh toan don hang ${order._id}`;
    const amount = order.totalPrice * 100; // Chuyển sang số tiền * 100
    const locale = 'vn';

    let vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: amount,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: req.ip,
      vnp_CreateDate: createDate,
    };

    // Sắp xếp các tham số theo alphabet
    vnpParams = sortObject(vnpParams);

    // Tạo chuỗi ký tự cần ký
    const signData = querystring.stringify(vnpParams, { encode: false });

    // Tạo chữ ký
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac
      .update(new Buffer.from(signData, 'utf-8'))
      .digest('hex');

    // Thêm chữ ký vào params
    vnpParams['vnp_SecureHash'] = signed;

    // Tạo URL thanh toán
    const vnpayUrl = `${process.env.VNPAY_URL}?${querystring.stringify(
      vnpParams,
      { encode: false }
    )}`;

    res.json({ code: '00', data: vnpayUrl });
  } catch (error) {
    console.error('Error creating payment URL:', error);
    res.status(500).json({
      message: 'Error creating payment URL',
      error: error.message,
    });
  }
};

// Hàm sắp xếp object theo alphabet
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    if (obj.hasOwnProperty(key)) {
      sorted[key] = obj[key];
    }
  }
  return sorted;
}

// Xử lý callback từ VNPay
const vnpayReturn = async (req, res) => {
  try {
    const vnpParams = req.query;
    const secureHash = vnpParams['vnp_SecureHash'];

    // Xóa chữ ký khỏi object để verify
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    // Sắp xếp lại các tham số
    const sortedVnpParams = sortObject(vnpParams);

    // Tạo chuỗi ký tự để verify
    const signData = querystring.stringify(sortedVnpParams, { encode: false });

    // Tạo chữ ký để verify
    const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
    const signed = hmac
      .update(new Buffer.from(signData, 'utf-8'))
      .digest('hex');

    // So sánh chữ ký
    if (secureHash === signed) {
      // Verify thành công
      const orderId = vnpParams['vnp_TxnRef'];
      const rspCode = vnpParams['vnp_ResponseCode'];

      // Cập nhật trạng thái đơn hàng
      if (rspCode === '00') {
        // Thanh toán thành công
        // Cập nhật order trong database
        const order = await Order.findById(orderId);
        if (order) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: vnpParams['vnp_TransactionNo'],
            status: 'success',
            update_time: vnpParams['vnp_PayDate'],
            bankCode: vnpParams['vnp_BankCode'],
          };
          await order.save();
        }
      }

      res.json({ code: vnpParams['vnp_ResponseCode'] });
    } else {
      res.status(400).json({ code: '97', message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('VNPay Return Error:', error);
    res.status(500).json({ code: '99', message: 'Internal Server Error' });
  }
};
