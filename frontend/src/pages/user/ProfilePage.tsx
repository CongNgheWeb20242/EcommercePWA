// ProfilePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ArrowRightOnRectangleIcon,
    EyeIcon,
    EyeSlashIcon,
    PencilIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import useOrderStore from '@/store/useOrderStore';
import { userStore } from '@/store/userStore';
import { Order } from '@/types/Order';
import { getUserOrder } from '@/services/api/orderService';
import { useNavigate } from 'react-router-dom';
import CustomImage from '@/components/ui/image';
import { updateProfile } from '@/services/api/userService';
import Avatar from '@/components/ui/avatar';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate()
    const { logOut } = userStore()
    const [showPassword, setShowPassword] = useState(false);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Order Store
    const {
        orderHistory,
        isLoading,
        addToOrderHistory,
        getPendingOrders,
        getPaidOrders,
        getDeliveredOrders,
        setLoading,
        clearCurrentOrder,
        clearOrderHistory
    } = useOrderStore();

    const { user } = userStore();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-2xl font-semibold mb-4">Bạn chưa đăng nhập</div>
                <div className="text-gray-500 mb-6">Vui lòng đăng nhập để xem thông tin cá nhân và lịch sử đơn hàng.</div>
                <button
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    onClick={() => { navigate('/user/login') }}
                >
                    Đăng nhập
                </button>
            </div>
        );
    }
    const fetchOrders = async (isReload: Boolean) => {
        if (!user?._id) return;
        setLoading(true);
        const orders = await getUserOrder();
        if (orders && !isReload)
            orders.forEach((order: Order) => addToOrderHistory(order));

        setLoading(false);

    };

    useEffect(() => {
        clearCurrentOrder();
        clearOrderHistory();
    }, []);

    useEffect(() => {

        fetchOrders(false);
    }, [user?._id, setLoading, addToOrderHistory]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Người Bán Đang Chuẩn Bị Hàng":
            case "PROCESSING":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Đang Giao Hàng":
            case "SHIPPING":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "Đã Giao Hàng":
            case "DELIVERED":
                return "bg-green-100 text-green-800 border-green-200";
            case "PAID":
                return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "CANCELLED":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusText = (order: Order) => {
        if (order.isDelivered) return "Đã Giao Hàng";
        if (order.isPaid) return "Đã Thanh Toán";
        return "Người Bán Đang Chuẩn Bị Hàng";
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            setUploadError('');

            // Chuyển ảnh sang base64
            const reader = new FileReader();
            reader.readAsDataURL(file);

            const base64Image = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });

            // Gọi API cập nhật
            const currentUser = userStore.getState().user;
            if (!currentUser) return;

            await updateProfile({
                name: currentUser.name,
                profilePic: base64Image
            });

            // Cập nhật store
            userStore.getState().setUser({ ...currentUser, profilePic: base64Image });

        } catch (err) {
            setUploadError('Có lỗi xảy ra khi tải lên ảnh đại diện');
        } finally {
            setIsUploading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Profile Card */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
                                <div className="relative inline-block">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        {user.profilePic ?
                                            <Avatar
                                                src={user.profilePic}
                                                alt={user.name}
                                                className="w-full h-full rounded-full object-cover aspect-square"
                                            /> :
                                            <UserIcon className="w-12 h-12 text-gray-600" />
                                        }
                                    </div>
                                    <button
                                        className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                                        onClick={handleAvatarClick}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <ArrowPathIcon className="w-4 h-4 text-gray-600 animate-spin" />
                                        ) : (
                                            <PencilIcon className="w-4 h-4 text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold text-white mt-4">{user.name}</h2>
                                <p className="text-blue-100 text-sm">Khách hàng thân thiết</p>
                            </div>

                            {/* Profile Info */}
                            <div className="p-6 space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium text-gray-900">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <PhoneIcon className="w-5 h-5 text-gray-500" />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Số điện thoại</p>
                                            <p className="font-medium text-gray-900">{user.phone ? user.phone : "Chưa cung cấp"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <MapPinIcon className="w-5 h-5 text-gray-500" />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Địa chỉ</p>
                                            <p className="font-medium text-gray-900">{user.address ? user.address : "Chưa cung cấp"}</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                    onClick={() => { logOut(), navigate('/user/login'); }}>
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                    <span>Đăng Xuất</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Activity Table - Updated để sử dụng orderHistory */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center gap-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Hoạt Động Gần Đây</h3>
                                    <p className="text-gray-500 mt-1">Lịch sử đặt hàng và giao dịch của bạn</p>
                                </div>
                                <button
                                    onClick={() => { fetchOrders(true) }}
                                    disabled={isLoading}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                                >
                                    <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    <span>Làm mới</span>
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-500 mt-4">Đang tải dữ liệu...</p>
                                </div>
                            ) : orderHistory.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-gray-500">Chưa có đơn hàng nào</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Mã Đơn
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Sản Phẩm
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Số Lượng
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Tổng Tiền
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Trạng Thái
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {orderHistory.map((order) => (
                                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-mono text-sm font-medium text-gray-900">
                                                            #{order._id?.slice(-6).toUpperCase()}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            {order.orderItems.slice(0, 2).map((item, index) => (
                                                                <div key={index} className="text-sm text-gray-900">
                                                                    Sản phẩm #{item.product.slice(-4)}
                                                                </div>
                                                            ))}
                                                            {order.orderItems.length > 2 && (
                                                                <div className="text-xs text-gray-500">
                                                                    +{order.orderItems.length - 2} sản phẩm khác
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                                                {order.orderItems.reduce((total, item) => total + item.quantity, 0)} sản phẩm
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-bold text-gray-900">
                                                            {formatPrice(order.totalPrice)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(getStatusText(order))}`}>
                                                            {getStatusText(order)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {orderHistory.length > 0 && (
                                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        Hiển thị {Math.min(orderHistory.length, 10)} của {orderHistory.length} kết quả
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50">
                                            Trước
                                        </button>
                                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                                            1
                                        </button>
                                        <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50">
                                            Tiếp
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Đơn chờ xử lý</p>
                                        <p className="text-2xl font-bold text-yellow-600">{getPendingOrders().length}</p>
                                    </div>
                                    <div className="bg-yellow-100 p-3 rounded-full">
                                        <span className="text-yellow-600 text-xl">⏳</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Đã thanh toán</p>
                                        <p className="text-2xl font-bold text-blue-600">{getPaidOrders().length}</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <span className="text-blue-600 text-xl">💳</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Đã giao hàng</p>
                                        <p className="text-2xl font-bold text-green-600">{getDeliveredOrders().length}</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <span className="text-green-600 text-xl">✅</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
