// Import hook useState và dữ liệu giả mockOrders
import { useState } from 'react';
import { mockOrders } from '../../data/mockData';

// Khai báo interface cho từng sản phẩm trong đơn hàng
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

// Interface cho một đơn hàng
interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'bank_transfer' | 'credit_card';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
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

  // Hàm chuyển phương thức thanh toán thành tiếng Việt
  const getPaymentMethodText = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng';
      case 'bank_transfer': return 'Chuyển khoản';
      case 'credit_card': return 'Thẻ tín dụng';
      default: return method;
    }
  };

  // Hàm chuyển trạng thái thanh toán thành tiếng Việt
  const getPaymentStatusText = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán';
      case 'paid': return 'Đã thanh toán';
      case 'failed': return 'Thanh toán thất bại';
      default: return status;
    }
  };

  // Giao diện chính của thẻ đơn hàng
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Thông tin tiêu đề và trạng thái */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-lg">Đơn hàng #{order.id}</h3>
          <p className="text-gray-600">{order.customerName}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </span>
      </div>

      {/* Thông tin chi tiết đơn hàng */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}</p>
        <p className="text-sm text-gray-600">Tổng tiền: ${order.totalAmount.toLocaleString()}</p>
        <p className="text-sm text-gray-600">Phương thức: {getPaymentMethodText(order.paymentMethod)}</p>
        <p className="text-sm text-gray-600">Trạng thái thanh toán: {getPaymentStatusText(order.paymentStatus)}</p>
      </div>

      {/* Danh sách sản phẩm trong đơn */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Sản phẩm:</h4>
        <ul className="space-y-2">
          {order.items.map((item, index) => (
            <li key={index} className="flex justify-between text-sm">
              <span>{item.name} x {item.quantity}</span>
              <span>${item.total.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Thông tin giao hàng */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Thông tin giao hàng:</h4>
        <p className="text-sm text-gray-600">{order.shippingAddress}</p>
        <p className="text-sm text-gray-600">Điện thoại: {order.customerPhone}</p>
        <p className="text-sm text-gray-600">Email: {order.customerEmail}</p>
      </div>

      {/* Chọn để cập nhật trạng thái đơn hàng */}
      <div className="flex space-x-2">
        <select
          value={order.status}
          onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
          className="px-3 py-1 border rounded-md"
          title="Cập nhật trạng thái đơn hàng"
          aria-label="Cập nhật trạng thái đơn hàng"
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
  // State lưu danh sách đơn hàng sau khi chuẩn hóa từ mockOrders
  const [orders, setOrders] = useState<Order[]>(
    mockOrders.map(order => {
      // Chuẩn hóa địa chỉ giao hàng nếu có dạng object
      const shippingAddress = typeof order.shippingAddress === 'string'
        ? order.shippingAddress
        : order.shippingAddress
          ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
          : '';

      // Chuẩn hóa danh sách sản phẩm trong đơn
      const items = order.items ? order.items.map(item => {
        const productId = 'productId' in item ? item.productId : item.id;
        const total = 'total' in item ? item.total : item.price * item.quantity;
        return {
          productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total
        };
      }) : [];

      // Trả về object đơn hàng chuẩn hóa
      return {
        id: order.id,
        customerName: order.customerName || order.customer || '',
        customerEmail: order.customerEmail || order.email || '',
        customerPhone: order.customerPhone || '',
        shippingAddress,
        items,
        totalAmount: order.totalAmount || order.total || 0,
        status: (order.status as Order['status']) || 'pending',
        paymentMethod: (order.paymentMethod as Order['paymentMethod']) || 'cod',
        paymentStatus: (order.paymentStatus as Order['paymentStatus']) || 'pending',
        createdAt: order.createdAt || order.date || new Date().toISOString(),
        updatedAt: order.updatedAt || new Date().toISOString()
      };
    })
  );

  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [statusFilter, setStatusFilter] = useState<Order['status'] | ''>(''); // Lọc theo trạng thái

  // Lọc đơn hàng theo từ khóa tìm kiếm và trạng thái
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Hàm cập nhật trạng thái đơn hàng
  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  // Giao diện hiển thị toàn bộ danh sách đơn hàng và các bộ lọc
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
      </div>

      {/* Bộ lọc tìm kiếm và trạng thái */}
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm đơn hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md flex-1"
          title="Tìm kiếm đơn hàng"
          aria-label="Tìm kiếm đơn hàng"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Order['status'] | '')}
          className="px-4 py-2 border rounded-md"
          title="Lọc theo trạng thái đơn hàng"
          aria-label="Lọc theo trạng thái đơn hàng"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="processing">Đang xử lý</option>
          <option value="shipped">Đang giao</option>
          <option value="delivered">Đã giao</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Danh sách đơn hàng hiển thị dưới dạng thẻ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default Orders;
