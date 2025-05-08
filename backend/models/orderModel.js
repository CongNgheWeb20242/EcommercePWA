import mongoose from 'mongoose';

// Sửa lại schema Order
const orderSchema = new mongoose.Schema(
  { // Danh sách sản phẩm trong đơn hàng
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    // Địa chỉ giao hàng
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      // Mã bưu điện
      postalCode: String,
      country: { type: String, required: true },
      // API Maps
      location: {
        lat: Number,
        lng: Number,
        address: String,
        name: String,
        vicinity: String,
        googleAddressId: String,
      },
    },
    // Thanh toán
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      amount: Number,
      bankCode: String, // Mã ngân hàng (VNPay)
      payType: String, // Loại thanh toán (MoMo: `captureWallet`, `payWithATM`)
    },
    itemsPrice: { type: Number, required: true }, // // Tổng giá trị sản phẩm trong đơn
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true }, // Thuế VAT
    totalPrice: { type: Number, required: true }, // Tổng tiền cần thanh toán
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
