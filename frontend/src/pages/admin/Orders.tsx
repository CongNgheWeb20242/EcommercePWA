import { useState, useEffect } from 'react';
import axios from 'axios';

// Định nghĩa các interfaces cần thiết
interface OrderItem {
  product: string; // MongoDB ID của sản phẩm
  name: string;
  quantity: number;
  image: string;
  price: number;
  _id?: string;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  user: string; // ID của user
  userName?: string; // Tên user (thêm từ frontend)
  userEmail?: string; // Email user (thêm từ frontend)
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  orders: Order[];
  page: number;
  pages: number;
}

// Component hiển thị từng đơn hàng
const OrderCard = ({
  order,
  onUpdateStatus,
}: {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: Order['status']) => void;
}) => {
  // Hàm trả về màu sắc tương ứng với trạng thái đơn hàng
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm trả về nội dung tiếng Việt tương ứng với trạng thái đơn hàng
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  // Giao diện chính của thẻ đơn hàng
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Thông tin tiêu đề và trạng thái */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-lg">Đơn hàng #{order._id.substring(order._id.length - 6)}</h3>
          <p className="text-gray-600">{order.userName || 'Người dùng không xác định'}</p>
          <p className="text-gray-500 text-sm">{order.userEmail || 'Không có email'}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </span>
      </div>

      {/* Thông tin chi tiết đơn hàng */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
        <p className="text-sm text-gray-600">Tổng tiền: ${order.totalPrice.toLocaleString()}</p>
        <p className="text-sm text-gray-600">Phương thức: {order.paymentMethod}</p>
        <p className="text-sm text-gray-600">
          Trạng thái thanh toán: {order.isPaid ? `Đã thanh toán (${new Date(order.paidAt || '').toLocaleDateString('vi-VN')})` : 'Chưa thanh toán'}
        </p>
        <p className="text-sm text-gray-600">
          Trạng thái giao hàng: {order.isDelivered ? `Đã giao (${new Date(order.deliveredAt || '').toLocaleDateString('vi-VN')})` : 'Chưa giao'}
        </p>
      </div>

      {/* Danh sách sản phẩm trong đơn */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Sản phẩm:</h4>
        <ul className="space-y-2">
          {order.orderItems.map((item, index) => (
            <li key={index} className="flex justify-between text-sm">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Thông tin giao hàng */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Thông tin giao hàng:</h4>
        <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
        <p className="text-sm text-gray-600">{`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}</p>
      </div>

      {/* Chọn để cập nhật trạng thái đơn hàng */}
      <div className="flex space-x-2">
        <select
          value={order.status}
          onChange={(e) => onUpdateStatus(order._id, e.target.value as Order['status'])}
          className="px-3 py-1 border rounded-md"
          title="Cập nhật trạng thái đơn hàng"
        >
          <option value="pending">Chờ xử lý</option>
          <option value="processing">Đang xử lý</option>
          <option value="shipped">Đang giao</option>
          <option value="delivered">Đã giao</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>
    </div>
  );
};

// Component chính hiển thị danh sách đơn hàng
const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [statusFilter, setStatusFilter] = useState<Order['status'] | ''>(''); // Lọc theo trạng thái
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Gọi API để lấy dữ liệu đơn hàng
  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get<ApiResponse>(
        `http://localhost:5000/api/orders/admin?page=${page}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      // Bổ sung thông tin user cho dễ hiển thị
      const ordersWithUserInfo = await Promise.all(
        data.orders.map(async (order) => {
          try {
            // Gọi API để lấy thông tin user từ ID
            const userResponse = await axios.get(`http://localhost:5000/api/users/${order.user}`, {
              headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            
            return {
              ...order,
              userName: userResponse.data.name,
              userEmail: userResponse.data.email,
            };
          } catch (err) {
            return {
              ...order,
              userName: 'Không tìm thấy',
              userEmail: 'Không tìm thấy',
            };
          }
        })
      );
      
      setOrders(ordersWithUserInfo);
      setTotalPages(data.pages);
      setCurrentPage(data.page);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Lọc đơn hàng theo từ khóa tìm kiếm và trạng thái
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id.includes(searchTerm) ||
      (order.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Hàm cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      // Cập nhật state sau khi API thành công
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  // Giao diện của Component Orders
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Bộ lọc và tìm kiếm */}
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md flex-1"
          title="Tìm kiếm đơn hàng"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Order['status'] | '')}
          className="px-4 py-2 border rounded-md"
          title="Lọc theo trạng thái"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="processing">Đang xử lý</option>
          <option value="shipped">Đang giao</option>
          <option value="delivered">Đã giao</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Hiển thị danh sách đơn hàng */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
          
          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchOrders(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
