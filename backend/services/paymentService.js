// createOrder, updateOrderStatus

export const createOrder = async (orderData) => {
  // Hardcode dữ liệu đơn hàng
  const {
    fullName,
    phone,
    email,
    address,
    detailedAddress,
    note,
    paymentMethod, // 'cod' hoặc 'vnpay'
    products,
    shippingFee = 30000, // mặc định nếu chưa tính động
  } = orderData;

  const totalAmount = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const grandTotal = totalAmount + shippingFee;

  const fakeOrder = {
    order_id: 'ORDER' + Date.now(),
    amount: grandTotal,
    customer: { fullName, phone, email, address, detailedAddress, note },
    payment: {
      method: paymentMethod,
      status: paymentMethod === 'cod' ? 'unpaid' : 'pending',
    },
    products,
    shippingFee,
    totalAmount,
    grandTotal,
    createdAt: new Date(),
    status: 'pending',
  };

  return fakeOrder;
};