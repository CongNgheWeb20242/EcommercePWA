import { useState, useEffect } from 'react';
import { axiosInstance } from '../../config/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '../../store/userStore';
import { Navigate } from 'react-router-dom';

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
  user: string; // ID của user
  userName?: string; // Tên user (thêm từ frontend)
  userEmail?: string; // Email user (thêm từ frontend)
  userPhone?: string; // SĐT user (thêm từ frontend)
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

// Định nghĩa kiểu dữ liệu đơn hàng từ server
interface ServerOrder {
  _id: string;
  order_id?: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  user: {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
  } | string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Component chính hiển thị danh sách đơn hàng
const Orders = () => {
  const { user: currentUser } = useUserStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [redirectToHome, setRedirectToHome] = useState(false);

  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [statusFilter, setStatusFilter] = useState<Order['status'] | ''>(''); // Lọc theo trạng thái
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Kiểm tra quyền admin
  useEffect(() => {
    console.log("Kiểm tra quyền admin:", currentUser);
    if (!currentUser || !currentUser.isAdmin) {
      setRedirectToHome(true);
    }
  }, [currentUser]);

  // Hàm để lấy màu sắc trạng thái
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'processing': return 'text-blue-600';
      case 'shipped': return 'text-purple-600';
      case 'delivered': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
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

  // Gọi API để lấy dữ liệu đơn hàng
  const fetchOrders = async (page = currentPage) => {
    if (!currentUser || !currentUser.isAdmin) {
      setError('Bạn không có quyền truy cập trang này');
      setLoading(false);
      return;
    }

    if (!currentUser.token) {
      setError('Không tìm thấy token xác thực, vui lòng đăng nhập lại');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Tạo URL với các tham số lọc và sắp xếp
      const params = new URLSearchParams({
        page: page.toString(),
        sortField: sortField,
        sortOrder: sortDirection,
      });
      
      if (searchTerm) params.append('query', searchTerm);
      if (statusFilter) params.append('status', statusFilter);

      console.log('Đang gọi API để lấy danh sách đơn hàng...');
      console.log('Token: ', currentUser?.token);
      
      // Gọi API với cấu hình headers rõ ràng để đảm bảo token được gửi đúng
      const response = await axiosInstance.get(`/orders?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Dữ liệu trả về từ API:', response.data);
      
      // Xử lý dữ liệu trả về
      let ordersData = response.data;
      
      // In ra thông tin debug về kiểu dữ liệu
      console.log('Kiểu dữ liệu của ordersData:', typeof ordersData, Array.isArray(ordersData));
      
      // Nếu response.data là một mảng, sử dụng trực tiếp
      // Nếu response.data có trường orders, sử dụng trường đó
      if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data && response.data.orders && Array.isArray(response.data.orders)) {
        ordersData = response.data.orders;
        setTotalPages(response.data.pages || 1);
        setCurrentPage(response.data.page || 1);
      } else {
        // Nếu không phải mảng và không có trường orders là mảng
        console.log('Dữ liệu không phải là mảng và không có trường orders là mảng');
        ordersData = [];
      }
      
      // Nếu không có đơn hàng nào, hiển thị thông báo nhưng không dùng dữ liệu mẫu nữa
      if (!Array.isArray(ordersData) || ordersData.length === 0) {
        console.log('Không có đơn hàng nào từ API');
        setOrders([]);
        setError('Không có đơn hàng nào trong hệ thống.');
        return;
      }
      
      // Đảm bảo ordersData là một mảng trước khi map
      if (!Array.isArray(ordersData)) {
        console.error('ordersData không phải là mảng sau khi xử lý:', ordersData);
        ordersData = [];
      }
      
      // Xử lý dữ liệu đơn hàng
      const processedOrders = ordersData.map((order: ServerOrder) => {
        // Đảm bảo mỗi đơn hàng có thông tin user
        let userName = 'Không xác định';
        let userPhone = '';
        
        if (typeof order.user === 'object' && order.user !== null) {
          userName = order.user.name || 'Không xác định';
          userPhone = order.user.phone || '';
        }
        
        // Xử lý orderItems để đảm bảo có name và price
        const processedItems = order.orderItems.map(item => {
          // Định nghĩa kiểu cho product object
          interface ProductObject {
            _id: string;
            name: string;
            price: number;
            image?: string;
          }

          // Nếu item.product là object có name và price, sử dụng giá trị từ đó
          if (typeof item.product === 'object' && item.product !== null) {
            const productObj = item.product as unknown as ProductObject;
            if ('name' in productObj) {
              return {
                ...item,
                name: item.name || productObj.name,
                price: item.price || productObj.price,
                image: item.image || (productObj.image || ''),
                product: productObj._id
              };
            }
          }
          // Nếu không, giữ nguyên
          return item;
        });
        
        return {
          ...order,
          userName,
          userPhone,
          orderItems: processedItems,
          user: typeof order.user === 'object' ? order.user._id : order.user,
          status: order.status || (order.isDelivered ? 'delivered' : (order.isPaid ? 'processing' : 'pending'))
        } as Order;
      });
      
      setOrders(processedOrders);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      let errorMessage = 'Lỗi khi tải danh sách đơn hàng';
      
      if (err instanceof Error) {
        errorMessage += ': ' + err.message;
      }
      
      // Kiểm tra nếu lỗi có response từ server
      if (err && typeof err === 'object' && 'response' in err) {
        // Định nghĩa kiểu cho Error response
        interface ErrorResponse {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
        
        const errorObj = err as ErrorResponse;
        if (errorObj.response && errorObj.response.data && errorObj.response.data.message) {
          errorMessage = String(errorObj.response.data.message);
        }
      }
      
      setError(errorMessage);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!redirectToHome) {
      fetchOrders(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, sortField, sortDirection, redirectToHome]);

  // Chuyển hướng nếu không phải admin
  if (redirectToHome) {
    console.log("Không phải admin, chuyển hướng về trang chủ");
    return <Navigate to="/" replace />;
  }

  // Lọc đơn hàng theo từ khóa tìm kiếm nếu cần
  const filteredOrders = orders;

  // Hàm cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    if (!currentUser || !currentUser.isAdmin) {
      setError('Bạn không có quyền thực hiện hành động này');
      return;
    }

    if (!currentUser.token) {
      setError('Không tìm thấy token xác thực, vui lòng đăng nhập lại');
      return;
    }

    setLoading(true);
    try {
      // Gọi API để cập nhật trạng thái đơn hàng - sửa đường dẫn và thêm headers rõ ràng
      await axiosInstance.put(`/orders/${orderId}/${newStatus === 'delivered' ? 'deliver' : 'status'}`, 
        { 
          status: newStatus,
          isDelivered: newStatus === 'delivered'
        },
        {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Cập nhật state sau khi API thành công
      setOrders(orders.map(order => 
        order._id === orderId ? { 
          ...order, 
          status: newStatus,
          isDelivered: newStatus === 'delivered',
          deliveredAt: newStatus === 'delivered' ? new Date().toISOString() : order.deliveredAt
        } : order
      ));
      
      setSuccessMessage(`Đã cập nhật trạng thái đơn hàng #${orderId.substring(orderId.length - 6)}`);
      
      // Xóa thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Lỗi khi cập nhật trạng thái đơn hàng');
      console.error('Error updating order status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý sắp xếp
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Hiển thị biểu tượng sắp xếp
  const getSortIcon = (field: string) => {
    if (field !== sortField) return <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400" />;
    return sortDirection === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} className="ml-1 text-blue-500" />
      : <FontAwesomeIcon icon={faSortDown} className="ml-1 text-blue-500" />;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
      </div>

      {/* Hiển thị thông báo thành công */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Bộ lọc và tìm kiếm */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
        <input
          type="text"
            placeholder="Tìm kiếm theo mã đơn, tên hoặc SĐT..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-md p-2 pl-10"
          title="Tìm kiếm đơn hàng"
        />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Order['status'] | '')}
            className="w-full border rounded-md p-2 pl-10 appearance-none"
          title="Lọc theo trạng thái"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="processing">Đang xử lý</option>
          <option value="shipped">Đang giao</option>
          <option value="delivered">Đã giao</option>
          <option value="cancelled">Đã hủy</option>
        </select>
          <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('userName')}>
                Người Dùng {getSortIcon('userName')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số Điện Thoại
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa Chỉ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên Đơn Hàng
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số Lượng
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('totalPrice')}>
                Tổng Giá Tiền {getSortIcon('totalPrice')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                Tình Trạng {getSortIcon('status')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
      {loading ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không tìm thấy đơn hàng nào
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                order.orderItems.map((item, index) => (
                  <tr key={`${order._id}_${index}`} className="hover:bg-gray-50">
                    {index === 0 ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap" rowSpan={order.orderItems.length}>
                          <div className="text-sm font-medium text-gray-900">{order.userName || 'Không xác định'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" rowSpan={order.orderItems.length}>
                          <div className="text-sm text-gray-500">{order.userPhone || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" rowSpan={order.orderItems.length}>
                          <div className="text-sm text-gray-500">
                            {order.shippingAddress ? 
                              (order.shippingAddress.address || '') + 
                              (order.shippingAddress.city ? ', ' + order.shippingAddress.city : '') 
                              : ''}
            </div>
                        </td>
                      </>
                    ) : null}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.size || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.quantity}</div>
                    </td>
                    {index === 0 ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap" rowSpan={order.orderItems.length}>
                          <div className="text-sm font-medium text-gray-900">{order.totalPrice?.toLocaleString()} đ</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" rowSpan={order.orderItems.length}>
                          <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" rowSpan={order.orderItems.length}>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'delivered')}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs cursor-pointer"
                              disabled={order.status === 'delivered' || order.status === 'cancelled'}
                            >
                              Xác nhận
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs cursor-pointer"
                              disabled={order.status === 'delivered' || order.status === 'cancelled'}
                            >
                              Hủy
                            </button>
            </div>
                        </td>
                      </>
                    ) : null}
                  </tr>
                ))
              ))
            )}
          </tbody>
        </table>
      </div>
          
          {/* Phân trang */}
          {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => fetchOrders(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              Trước
            </button>
            
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchOrders(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer ${
                    currentPage === page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            
            <button
              onClick={() => fetchOrders(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === totalPages 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              Sau
            </button>
          </nav>
            </div>
      )}
    </div>
  );
};

export default Orders;
