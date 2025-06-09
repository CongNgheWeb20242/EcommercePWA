import { useState, useEffect } from 'react';
import { axiosInstance } from '../../config/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userStore } from '@/store/userStore';

const STATUS_TEXTS = ['Đang chuẩn bị hàng', 'Đang giao', 'Đã giao'];

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
  status?: number;
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
  const { user: currentUser } = userStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredOrderId, setHoveredOrderId] = useState<string | null>(null);
  const [actionDropdownOrderId, setActionDropdownOrderId] = useState<string | null>(null);

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
    onConfirm: () => { },
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
      console.log('Orders data:', ordersData);

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
          userPhone,
          // Nếu status không có từ API, mặc định là 0 (Đang chuẩn bị)
          status: order.status !== undefined ? order.status : 0,
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
  const filteredOrders = orders
    .filter(order => {
      if (!searchTerm.trim()) return true; // Giữ nguyên: nếu ô tìm kiếm rỗng, hiện tất cả

      const normalizeText = (str: string = '') => (str || '').toLowerCase().trim();
      const normalizePhone = (str: string = '') => (str || '').replace(/\D/g, '');

      const lcSearchTermText = normalizeText(searchTerm); // Chuỗi tìm kiếm đã chuẩn hóa cho tên
      const searchDigits = normalizePhone(searchTerm); // Các chữ số từ chuỗi tìm kiếm cho SĐT

      // 1. Tìm kiếm theo Tên Người Dùng
      const nameMatch = normalizeText(order.userName).includes(lcSearchTermText);

      // 2. Tìm kiếm theo Số Điện Thoại (chỉ khi searchDigits không rỗng)
      let phoneMatch = false;
      if (searchDigits) { // Chỉ tìm SĐT nếu có nhập số
        const shippingPhone = normalizePhone(order.shippingAddress?.phone);
        const userModelPhone = normalizePhone(order.userPhone); // SĐT từ User model (hiện tại backend không gửi, nên sẽ là chuỗi rỗng)

        if (shippingPhone.includes(searchDigits) || userModelPhone.includes(searchDigits)) {
          phoneMatch = true;
        }
      }

      return nameMatch || phoneMatch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sắp xếp theo thời gian tạo, mới nhất lên đầu

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
  const handleUpdateStatus = async (orderId: string, newStatus: number) => {
    if (!currentUser || !currentUser.isAdmin) {
      toast.error('Bạn không có quyền thực hiện hành động này');
      return;
    }

    const order = orders.find(o => o._id === orderId);
    if (!order) {
      toast.error('Không tìm thấy đơn hàng!');
      return;
    }

    // Kiểm tra xem trạng thái mới có khác trạng thái hiện tại không
    if (order.status === newStatus) {
      toast('Đơn hàng đã ở trạng thái này.');
      return;
    }

    const confirmAction = async () => {
      try {
        const response = await axiosInstance.put<{ message: string, order: Order }>(
          `/orders/${orderId}/status`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            }
          }
        );
        const updatedOrderFromServer = response.data.order;

        setOrders(currentOrders => currentOrders.map(o => {
          if (o._id === orderId) {
            // Bắt đầu bằng cách lấy tất cả các trường từ server
            // Sau đó, ghi đè status và các trường liên quan dựa trên newStatus
            // để đảm bảo giao diện người dùng phản ánh hành động vừa thực hiện.
            return {
              ...o, // Giữ lại các trường client đã xử lý như userName, userPhone
              ...updatedOrderFromServer, // Áp dụng các thay đổi từ server (ví dụ: updatedAt)
              status: newStatus, // Đảm bảo status được cập nhật theo hành động của admin
              isDelivered: newStatus === 2, // Cập nhật isDelivered dựa trên newStatus
              deliveredAt: newStatus === 2 ? new Date().toISOString() : undefined, // Sửa: dùng undefined thay vì null
            };
          }
          return o;
        }));

        toast.success(`Đã cập nhật trạng thái đơn hàng thành "${STATUS_TEXTS[newStatus]}"`);

      } catch (err) {
        toast.error('Lỗi khi cập nhật trạng thái đơn hàng');
        console.error('Error updating order status:', err);
      }
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    };

    showConfirmDialog(
      'Xác nhận cập nhật trạng thái',
      `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành "${STATUS_TEXTS[newStatus]}" không?`,
      confirmAction
    );
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
              <th className="px-4 py-3 text-center font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Trạng Thái TT</th>
              <th className="px-4 py-3 text-center font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Ngày TT</th>
              <th className="px-4 py-3 text-center font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Trạng Thái GH</th>
              <th className="px-4 py-3 text-center font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Hành Động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={11} className="px-3 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-3 py-4 text-center text-xs text-gray-500">
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
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 align-middle" rowSpan={order.orderItems.length} style={{ verticalAlign: 'middle' }}>
                          {order.shippingAddress?.fullName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap align-middle" rowSpan={order.orderItems.length} style={{ verticalAlign: 'middle' }}>
                          {order.shippingAddress?.phone}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell align-middle max-w-[180px] truncate" rowSpan={order.orderItems.length} style={{ verticalAlign: 'middle' }}>
                          <span title={order.shippingAddress?.address}>
                            {order.shippingAddress?.address}
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
                        <td className="px-4 py-3 whitespace-nowrap text-right font-semibold align-middle" rowSpan={order.orderItems.length} style={{ verticalAlign: 'middle' }}>
                          {(order.totalPrice || 1950000).toLocaleString()} đ
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center align-middle" rowSpan={order.orderItems.length} style={{ verticalAlign: 'middle' }}>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {order.isPaid ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center align-middle" rowSpan={order.orderItems.length} style={{ verticalAlign: 'middle' }}>
                          {order.paidAt ? new Date(order.paidAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center align-middle" rowSpan={order.orderItems.length} style={{ verticalAlign: 'middle' }}>
                          {(() => {
                            let statusText = 'Chưa xác định';
                            let statusColor = 'bg-gray-100 text-gray-700';
                            switch (order.status) {
                              case 0:
                                statusText = STATUS_TEXTS[0];
                                statusColor = 'bg-yellow-100 text-yellow-700';
                                break;
                              case 1:
                                statusText = STATUS_TEXTS[1];
                                statusColor = 'bg-blue-100 text-blue-700';
                                break;
                              case 2:
                                statusText = STATUS_TEXTS[2];
                                statusColor = 'bg-green-100 text-green-700';
                                break;
                            }
                            return (
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                                {statusText}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center align-middle" rowSpan={order.orderItems.length} style={{ verticalAlign: 'middle' }}>
                          <div className="relative inline-block text-left">
                            <div>
                              <button
                                type="button"
                                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-1.5 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                                id={`menu-button-${order._id}`}
                                // aria-expanded={`${!!(actionDropdownOrderId === order._id)}`} // Tạm thời bình luận để tránh lỗi linter
                                aria-haspopup="true"
                                onClick={() => setActionDropdownOrderId(actionDropdownOrderId === order._id ? null : order._id)}
                              >
                                Hành động
                                <svg className="-mr-1 ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>

                            {actionDropdownOrderId === order._id && (
                              <div
                                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby={`menu-button-${order._id}`}
                              >
                                <div className="py-1" role="none">
                                  {STATUS_TEXTS.map((text, statusValue) => (
                                    <button
                                      key={statusValue}
                                      onClick={() => {
                                        handleUpdateStatus(order._id, statusValue);
                                        setActionDropdownOrderId(null);
                                      }}
                                      disabled={order.status === statusValue}
                                      className={`${order.status === statusValue ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        } block w-full text-left px-4 py-2 text-xs`}
                                      role="menuitem"
                                    >
                                      {text}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </>
                    ) : null}
                  </tr>
                )),
                // Dòng phân cách đậm giữa các đơn hàng
                <tr key={`divider_${order._id}`}>
                  <td colSpan={11} className="p-0">
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
