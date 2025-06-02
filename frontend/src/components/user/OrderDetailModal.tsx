import React, { useEffect, useState } from 'react';
import { Order } from '@/types/Order';
import { Product } from '@/types/Product';
import { getProductById } from '@/services/api/productService';
import { useNavigate } from 'react-router-dom';

interface OrderDetailModalProps {
    order: Order;
    onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Map<string, Product>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const productIds = order.orderItems.map(item => item.product);
                const results = await Promise.allSettled(
                    productIds.map(id => getProductById(id))
                );

                const productMap = new Map<string, Product>();
                results.forEach((result, index) => {
                    if (result.status === 'fulfilled' && result.value) {
                        productMap.set(productIds[index], result.value);
                    }
                });

                setProducts(productMap);
            } catch (err) {
                setError('Không thể tải thông tin sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        if (order) fetchProducts();
    }, [order]);

    const handleProductClick = (productId: string) => {
        navigate(`/user/product/${productId}`);
    };

    return (
        <div style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} className="fixed inset-0 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-2 animate-fadeInUp">
                {/* Nút đóng */}
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
                    onClick={onClose}
                >
                    ×
                </button>

                {/* Tiêu đề */}
                <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                    <span>Chi tiết đơn hàng</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-base font-mono">
                        #{order._id?.slice(-6).toUpperCase()}
                    </span>
                </h2>

                {/* Loading state */}
                {loading && (
                    <div className="text-center py-4">
                        <span className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                        <p className="mt-2 text-gray-600">Đang tải thông tin sản phẩm...</p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {/* Danh sách sản phẩm */}
                {!loading && <div className="mb-2 max-h-[20vh] overflow-y-auto">
                    <span className="font-semibold text-gray-700">Sản phẩm:</span>
                    <ul className="space-y-4 mt-2">
                        {order.orderItems.map((item, idx) => {
                            const product = products.get(item.product);
                            return (
                                <li key={idx} className="border-b pb-4 last:border-b-0"
                                    onClick={() => { handleProductClick(item.product) }}>
                                    {product ? (
                                        <div className="flex gap-4">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-20 h-20 object-cover rounded-lg border"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium">{product.name}</h3>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    <p>Thương hiệu: {product.brand}</p>
                                                    <p>Giá: {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                                    <p>Số lượng: {item.quantity}</p>
                                                    <p>Tổng: {(product.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-red-500 text-sm">
                                            Không thể tải thông tin sản phẩm #{item.product.slice(-4)}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>}

                {/* Tiêu đề */}
                <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                    <span>Chi tiết đơn hàng</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-base font-mono tracking-wider">
                        #{order._id?.slice(-6).toUpperCase()}
                    </span>
                </h2>
                {/* Ngày đặt */}
                <div className="mb-2 text-gray-700">
                    <span className="font-semibold">Ngày đặt:</span>{" "}
                    <span className="font-mono">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</span>
                </div>
                {/* Địa chỉ giao hàng */}
                <div className="mb-2 text-gray-700">
                    <span className="font-semibold">Địa chỉ giao hàng:</span>
                    <div className="ml-2 text-sm text-gray-600">
                        {order.shippingAddress.fullName}, {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
                    </div>
                </div>
                {/* Phương thức thanh toán */}
                <div className="mb-2 text-gray-700">
                    <span className="font-semibold">Phương thức thanh toán:</span>{" "}
                    <span className="uppercase">{order.paymentMethod}</span>
                </div>
                {/* Trạng thái */}
                <div className="mb-2 flex gap-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                        ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                        ${order.isDelivered ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {order.isDelivered ? 'Đã giao' : 'Chưa giao'}
                    </span>
                </div>
                {/* Tổng tiền */}
                <div className="mb-2 text-lg">
                    <span className="font-semibold text-gray-700">Tổng tiền:</span>{" "}
                    <span className="text-red-600 font-bold">
                        {order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                </div>
                {/* Kết quả thanh toán */}
                {order.paymentResult && (
                    <div className="mb-2 text-gray-700">
                        <span className="font-semibold">Kết quả thanh toán:</span>{" "}
                        <span className="font-mono">{order.paymentResult.status || 'N/A'}</span>
                    </div>
                )}
            </div>
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.3s cubic-bezier(.39,.575,.565,1) both;
                }
                @keyframes fadeInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                `}
            </style>
        </div>
    );
};

export default OrderDetailModal;
