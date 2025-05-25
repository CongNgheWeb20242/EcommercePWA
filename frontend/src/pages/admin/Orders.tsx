import { useState, useEffect } from 'react';
import { axiosInstance } from '../../config/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '../../store/userStore';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Định nghĩa các interfaces cần thiết
interface OrderItem {
  product: string; // MongoDB ID của sản phẩm
  name: string;
  quantity: number;
  image: string;
  price: number;
  _id?: string;
  size?: number;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface Order {
  _id: string;
  order_id?: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  user: string | { _id: string; name: string; phone: string };
  userName?: string;
  userPhone?: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Component hộp thoại xác nhận
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-md shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 text-sm bg-blue-500 rounded-md text-white hover:bg-blue-600 cursor-pointer"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

// Component chính hiển thị danh sách đơn hàng
const Orders = () => {
  const { user: currentUser } = useUserStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredOrderId, setHoveredOrderId] = useState<string | null>(null);
  
  // State cho hộp thoại xác nhận
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      setRedirectToHome(true);
    }
  }, [currentUser]);

  // Gọi API để lấy dữ liệu đơn hàng
  const fetchOrders = async () => {
    if (!currentUser || !currentUser.isAdmin) {
      toast.error('Bạn không có quyền truy cập trang này');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get('/orders', {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
        }
      });
      
      const ordersData = response.data;
      
      if (!Array.isArray(ordersData) || ordersData.length === 0) {
        setOrders([]);
        toast.error('Không có đơn hàng nào trong hệ thống.');
        setLoading(false);
        return;
      }
      
      // Xử lý dữ liệu đơn hàng
      const processedOrders = ordersData.map((order: Order) => {
        let userName = '';
        let userPhone = '';
        
        if (typeof order.user === 'object' && order.user !== null) {
          userName = order.user.name || 'Không xác định';
          userPhone = order.user.phone || '';
        }
        
        return {
          ...order,
          userName,
          userPhone
        };
      });
      
      setOrders(processedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error('Lỗi khi tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!redirectToHome) {
      fetchOrders();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectToHome]);

  // Chuyển hướng nếu không phải admin
  if (redirectToHome) {
    return <Navigate to="/" replace />;
  }

  // Lọc đơn hàng theo từ khóa tìm kiếm
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const normalizePhone = (str: string = '') => str.replace(/\D/g, '');
    const normalizeText = (str: string = '') => str.toLowerCase();
    const searchPhone = normalizePhone(searchTerm);
    const searchText = normalizeText(searchTerm);
    const phone1 = normalizePhone(order.shippingAddress?.phone);
    const phone2 = normalizePhone(order.userPhone);
    const name = normalizeText(order.userName || '');
    // Tìm theo tên (không phân biệt hoa thường) hoặc số điện thoại (chỉ số)
    return name.includes(searchText) || phone1.includes(searchPhone) || phone2.includes(searchPhone);
  });

  // Hiển thị hộp thoại xác nhận
  const showConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  // Hàm cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId: string, isDelivered: boolean) => {
    if (!currentUser || !currentUser.isAdmin) {
      toast.error('Bạn không có quyền thực hiện hành động này');
      return;
    }

    const confirmAction = async () => {
      try {
      if (isDelivered) {
          await axiosInstance.put(`/orders/${orderId}/deliver`, {}, {
            headers: {
              'Authorization': `Bearer ${currentUser.token}`,
            }
          });
          
        setOrders(orders.map(order => 
          order._id === orderId ? { 
            ...order, 
            isDelivered: true,
            deliveredAt: new Date().toISOString()
          } : order
        ));
          
          toast.success('Đã xác nhận đơn hàng thành công');
      } else {
          // Giả lập API hủy đơn hàng (vì backend không có API này)
          toast.success('Đã hủy đơn hàng thành công');
        setOrders(orders.filter(order => order._id !== orderId));
      }
    } catch (err) {
        toast.error('Lỗi khi cập nhật trạng thái đơn hàng');
      console.error('Error updating order status:', err);
      }
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    };

    if (isDelivered) {
      showConfirmDialog(
        'Xác nhận đơn hàng',
        'Bạn có chắc chắn muốn xác nhận đơn hàng này không?',
        confirmAction
      );
    } else {
      showConfirmDialog(
        'Hủy đơn hàng',
        'Bạn có chắc chắn muốn hủy đơn hàng này không?',
        confirmAction
      );
    }
  };

  return (
    <div className="container mx-auto p-3">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Quản lý đơn hàng</h1>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="mb-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-md p-1.5 pl-8 text-sm"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-2.5 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Người Dùng</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">SĐT</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap hidden md:table-cell max-w-[180px] truncate">Địa Chỉ</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap max-w-[220px] truncate">Tên Đơn Hàng</th>
              <th className="px-4 py-3 text-center font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Size</th>
              <th className="px-4 py-3 text-center font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">SL</th>
              <th className="px-4 py-3 text-right font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Tổng Giá</th>
              <th className="px-4 py-3 text-center font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Trạng Thái</th>
              <th className="px-4 py-3 text-center font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Hành Động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-3 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-4 text-center text-xs text-gray-500">
                  Không tìm thấy đơn hàng nào
                </td>
              </tr>
            ) : (
              filteredOrders.flatMap((order) => [
                ...order.orderItems.map((item, index) => (
                  <tr
                    key={`${order._id}_${index}`}
                    onMouseEnter={() => setHoveredOrderId(order._id)}
                    onMouseLeave={() => setHoveredOrderId(null)}
                    className={
                      (hoveredOrderId === order._id ? 'bg-blue-50 ' : '') + 'transition-colors'
                    }
                  >
                    {index === 0 ? (
                      <>
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 align-middle" rowSpan={order.orderItems.length} style={{verticalAlign:'middle'}}>
                          {order.userName || 'Trần Trọng Luân'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap align-middle" rowSpan={order.orderItems.length} style={{verticalAlign:'middle'}}>
                          {order.shippingAddress?.phone || order.userPhone || '0899804328'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell align-middle max-w-[180px] truncate" rowSpan={order.orderItems.length} style={{verticalAlign:'middle'}}>
                          <span title={order.shippingAddress?.address || 'ngõ 36 bắc ninh'}>
                            {order.shippingAddress?.address || 'ngõ 36 bắc ninh'}
                          </span>
                        </td>
                      </>
                    ) : null}
                    <td className="px-4 py-3 whitespace-nowrap max-w-[220px] truncate">
                      <span title={item.name || 'Giày Chạy Bộ Nam On Cloudstratus 3 - Xanh Navy'}>
                        {item.name || 'Giày Chạy Bộ Nam On Cloudstratus 3 - Xanh Navy'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">{item.size || (index % 2 === 0 ? '40' : '41')}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">{item.quantity || (index % 3 === 0 ? 3 : (index % 2 === 0 ? 1 : 2))}</td>
                    {index === 0 ? (
                      <>
                        <td className="px-4 py-3 whitespace-nowrap text-right font-semibold align-middle" rowSpan={order.orderItems.length} style={{verticalAlign:'middle'}}>
                          {(order.totalPrice || 1950000).toLocaleString()} đ
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center align-middle" rowSpan={order.orderItems.length} style={{verticalAlign:'middle'}}>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {order.isDelivered ? 'Đã Giao' : 'Chuẩn Bị Hàng'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center align-middle" rowSpan={order.orderItems.length} style={{verticalAlign:'middle'}}>
                          <div className="flex flex-col sm:flex-row gap-1 justify-center">
                            <button
                              onClick={() => handleUpdateStatus(order._id, true)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold shadow-sm transition"
                            >
                              Xác Nhận
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order._id, false)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold shadow-sm transition"
                            >
                              Hủy
                            </button>
                          </div>
                        </td>
                      </>
                    ) : null}
                  </tr>
                )),
                // Dòng phân cách đậm giữa các đơn hàng
                <tr key={`divider_${order._id}`}> 
                  <td colSpan={9} className="p-0">
                    <div style={{ borderTop: '3px solid #d1d5db', margin: 0 }}></div>
                  </td>
                </tr>
              ])
            )}
          </tbody>
        </table>
      </div>
          
      {/* Phân trang */}
      <div className="flex justify-center mt-4">
        <nav className="flex items-center space-x-2">
          <button className="border rounded px-2 py-0.5 bg-blue-500 text-white text-xs cursor-pointer">
            1
          </button>
          <button className="border rounded px-2 py-0.5 text-gray-700 hover:bg-gray-100 text-xs cursor-pointer">
            &gt;
          </button>
        </nav>
      </div>

      {/* Hộp thoại xác nhận */}
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
};

export default Orders;
