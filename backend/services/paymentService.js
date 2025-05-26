// createOrder, updateOrderStatus, findOrderByID
import Order from "../models/orderModel.js";
import mongoose from "mongoose";

export const createOrder = async (orderData) => {
  const {
    fullName,
    phone,
    email,
    address,
    detailedAddress,
    note,
    paymentMethod,
    shippingFee = 20000,
    products,
    user, // ObjectId của người dùng - cần được truyền từ controller
    taxRate = 0, // Mặc định 0
  } = orderData;

  // Calculate prices
  const itemsPrice = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxPrice = itemsPrice * taxRate;
  const totalPrice = itemsPrice + shippingFee + taxPrice;

  // Transform shipping address
  const shippingAddress = {
    fullName,
    address: `${address}, ${detailedAddress}`,
    city: address, // Using address as city since it's not provided separately
    country: 'Vietnam', // Default to Vietnam since it's not provided
    phone,
    email,
    note,
  };

  const order = new Order({
    order_id: 'ORDER' + Date.now(),
    user: new mongoose.Types.ObjectId(user),
    orderItems: products.map((item) => ({
      product: new mongoose.Types.ObjectId(item.id),
      quantity: item.quantity,
      price: item.price,
    })),
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice: shippingFee,
    taxPrice,
    totalPrice,
    paymentResult: {
      status: paymentMethod === 'cod' ? 'unpaid' : 'pending',
    },
  });

  const savedOrder = await order.save();
  return savedOrder;
};

export const updateOrderStatus = async (orderId, statusUpdate) => {
  const order = await Order.findOne({ order_id: orderId });
  if (!order) {
    throw new Error('Order not found');
  }

  const {
    isPaid,
    paidAt,
    paymentResult,
    isDelivered,
    deliveredAt,
  } = statusUpdate;

  if (isPaid !== undefined) order.isPaid = isPaid;
  if (paidAt) order.paidAt = paidAt;

  // Cập nhật từng phần của paymentResult thay vì ghi đè toàn bộ
  if (paymentResult) {
    order.paymentResult = {
      ...order.paymentResult?.toObject?.() || order.paymentResult || {},
      ...paymentResult,
    };
  }

  if (isDelivered !== undefined) order.isDelivered = isDelivered;
  if (deliveredAt) order.deliveredAt = deliveredAt;

  const updatedOrder = await order.save();
  return updatedOrder;
};

export const findOrderByID = async (orderId) => {
  const order = await Order.findOne({ order_id: orderId })
    .populate('user', 'name email') // lấy thêm thông tin người dùng
    .populate('orderItems.product', 'name image price'); // lấy thêm thông tin sản phẩm

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};