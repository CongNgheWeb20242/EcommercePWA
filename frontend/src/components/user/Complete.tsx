import useCartStore from '@/store/useCartStore';
import useCheckoutStore from '@/store/useCheckOutStore';
import React from 'react';
import { useNavigate } from 'react-router-dom';


const Complete: React.FC = () => {
    const navigate = useNavigate();
    const { orderId, getOrderStatus, customerInfo } = useCheckoutStore()
    const { totalPrice, items } = useCartStore()

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8 mb-8">
            <h1 className="text-3xl font-bold mb-4 text-green-600 flex items-center gap-2">
                <span>🎉</span> Đơn hàng của bạn đã hoàn tất!
            </h1>
            <p className="mb-2 text-lg text-gray-700">Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>
            <div className="mb-4 text-gray-600">
                <span>Mã đơn hàng: </span>
                <strong>{orderId}</strong>
            </div>
            <div className="mb-6 text-gray-600">
                <span>Trạng thái: </span>
                <strong className="text-green-700">{getOrderStatus()}</strong>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Chi tiết đơn hàng</h2>
                <ul className="divide-y divide-gray-200">
                    {items
                        .filter((item) => item.selected == true)
                        .map((item, index) => (
                            <li key={index} className="py-2 flex justify-between">
                                <span>
                                    {item.name} <span className="text-gray-500">x {item.quantity}</span>
                                </span>
                                <span>
                                    {(item.price * item.quantity).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </span>
                            </li>
                        ))}
                </ul>
                <div className="mt-4 font-bold text-right text-lg">
                    Tổng cộng:{' '}
                    {totalPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Thông tin thanh toán</h2>
                {customerInfo.paymentMethod === "cod" ? (
                    <p className="text-gray-700">Thanh toán khi nhận hàng (COD)</p>
                ) : (
                    <p className="text-gray-700">Thanh Toán Thành Công</p>
                )}
            </div>


            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Thông tin giao hàng</h2>
                <div className="text-gray-700 space-y-1">
                    <div>
                        <span className="font-semibold">Họ và tên:</span> {customerInfo.fullName}
                    </div>
                    <div>
                        <span className="font-semibold">Số điện thoại:</span> {customerInfo.phone}
                    </div>
                    <div>
                        <span className="font-semibold">Email:</span> {customerInfo.email}
                    </div>
                    <div>
                        <span className="font-semibold">Địa chỉ:</span>{" "}
                        {`${customerInfo.address}, ${customerInfo.ward}, ${customerInfo.district}, ${customerInfo.province}`}
                    </div>
                    {customerInfo.notes && (
                        <div>
                            <span className="font-semibold">Ghi chú:</span> {customerInfo.notes}
                        </div>
                    )}
                </div>
            </div>


            <div className="flex gap-4">
                <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    onClick={() => navigate('/')}
                >
                    Về trang chủ
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => navigate('/user/profile')}
                >
                    Xem đơn hàng của tôi
                </button>
            </div>
        </div>
    );
};

export default Complete;
