import { useState, useEffect } from 'react';
import { axiosInstance } from '../../config/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '../../store/userStore';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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

interface User {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  address?: string;
}

const Users = () => {
  const { user: currentUser } = useUserStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [adminFilter, setAdminFilter] = useState<boolean | ''>('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [redirectToHome, setRedirectToHome] = useState(false);
  
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

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Gọi API để lấy dữ liệu người dùng
  const fetchUsers = async (page = currentPage) => {
    setLoading(true);
    try {
      // Tạo URL với các tham số lọc và sắp xếp
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10', // Thêm giới hạn kết quả
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (adminFilter !== '') params.append('isAdmin', String(adminFilter));

      console.log('Đang gọi API để lấy danh sách người dùng...');
      console.log('URL: /user?' + params.toString());
      console.log('Token: ' + (currentUser?.token || 'không có token'));
      console.log('Người dùng hiện tại:', currentUser);
      
      // Đường dẫn API đúng theo routes trong backend và cấu hình axiosInstance
      const response = await axiosInstance.get(`/user?${params.toString()}`);
      
      console.log('API đã phản hồi thành công');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', response.headers);
      console.log('Kiểu dữ liệu trả về:', typeof response.data);
      console.log('Dữ liệu trả về từ API:', JSON.stringify(response.data, null, 2));
      
      // Xử lý dữ liệu trả về
      let userData = [];
      
      // Đảm bảo userData luôn là một mảng
      if (Array.isArray(response.data)) {
        console.log('Response là một mảng');
        userData = response.data;
      } else if (response.data && Array.isArray(response.data.users)) {
        console.log('Response chứa trường users là một mảng');
        userData = response.data.users;
      } else if (response.data && typeof response.data === 'object') {
        // Trường hợp trả về một đối tượng đơn lẻ
        console.log('API trả về một đối tượng, không phải mảng');
        if (response.data._id) {
          userData = [response.data];
        }
      }
      
      console.log('userData sau khi xử lý:', userData);
      
      // Kiểm tra một lần nữa để đảm bảo userData là mảng
      if (!Array.isArray(userData)) {
        console.error('userData không phải là mảng:', userData);
        userData = [];
      }
      
      setUsers(userData);
      
      // Cập nhật thông tin phân trang (giả định có 1 trang)
      setTotalPages(1);
      setCurrentPage(1);
      
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      
      // Hiển thị chi tiết lỗi để debug
      if (err && typeof err === 'object' && 'response' in err) {
        const errorResponse = err.response;
        console.error("Error response:", errorResponse);
        
        if (errorResponse && typeof errorResponse === 'object') {
          if ('status' in errorResponse) {
            console.error("Error status:", errorResponse.status);
          }
          if ('data' in errorResponse) {
            console.error("Error data:", errorResponse.data);
          }
        }
      }
      
      setError('Lỗi khi tải danh sách người dùng: ' + 
        (err instanceof Error ? err.message : 'Lỗi không xác định'));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra quyền admin
  useEffect(() => {
    // Kiểm tra nếu người dùng không phải admin
    if (!currentUser || !currentUser.isAdmin) {
      setRedirectToHome(true);
    }
  }, [currentUser]);

  useEffect(() => {
    // Chỉ gọi API nếu người dùng là admin
    if (currentUser?.isAdmin) {
      fetchUsers(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, adminFilter, sortField, sortDirection, currentUser]);

  // Nếu không phải admin, chuyển hướng về trang chính
  if (redirectToHome) {
    return <Navigate to="/" replace />;
  }

  // Lọc users trong trường hợp cần thiết (nếu không thể lọc bằng API)
  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));
      
    const matchesAdminFilter = adminFilter === '' || 
      user.isAdmin === (adminFilter === true);
      
    return matchesSearch && matchesAdminFilter;
  }) : [];

  // Xử lý xóa người dùng với xác nhận
  const handleDeleteUser = async (userId: string) => {
    // Kiểm tra xem người dùng hiện tại có phải admin không
    if (!currentUser?.isAdmin) {
      toast.error('Bạn không có quyền xóa người dùng');
      return;
    }
    
    // Ngăn xóa tài khoản admin
    const userToDelete = users.find(u => u._id === userId);
    if (userToDelete?.isAdmin) {
      toast.error('Không thể xóa tài khoản Admin');
      return;
    }
    
    const performDelete = async () => {
      setLoading(true);
      try {
        // Sử dụng đúng đường dẫn API theo cấu hình trong axiosInstance
        const response = await axiosInstance.delete(`/user/${userId}`);
        
        // Kiểm tra phản hồi từ server
        if (response.status === 200) {
          // Cập nhật danh sách sau khi xóa
          setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
          toast.success('Đã xóa người dùng thành công');
        } else {
          toast.error('Lỗi khi xóa người dùng: ' + (response.data?.message || 'Không thể xóa người dùng'));
        }
      } catch (err: unknown) {
        // Kiểm tra kiểu của lỗi và trích xuất thông điệp lỗi
        const errorMessage = err && typeof err === 'object' && 'response' in err && 
          err.response && typeof err.response === 'object' && 'data' in err.response && 
          err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
          ? String(err.response.data.message) 
          : 'Lỗi khi xóa người dùng';
        
        toast.error(errorMessage);
        console.error('Error deleting user:', err);
      } finally {
        setLoading(false);
        setConfirmDialog({...confirmDialog, isOpen: false});
      }
    };
    
    // Hiển thị hộp thoại xác nhận
    setConfirmDialog({
      isOpen: true,
      title: 'Xóa người dùng',
      message: `Bạn có chắc chắn muốn xóa người dùng ${userToDelete?.name || ''} không?`,
      onConfirm: performDelete
    });
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

  // Thêm hàm xem chi tiết user
  const handleViewUserDetail = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/user/${userId}`);
      setSelectedUser(response.data);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Error fetching user details:', err);
      toast.error('Không thể tải thông tin chi tiết người dùng');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản Lý Người Dùng</h1>
        <button 
          onClick={() => fetchUsers(1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Đang tải...' : 'Tải lại dữ liệu'}
        </button>
      </div>

      {/* Hiển thị thông báo thành công */}
      {/* {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )} */}

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
            placeholder="Tìm kiếm theo tên, email hoặc SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-md p-2 pl-10"
            title="Tìm kiếm người dùng"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={adminFilter === '' ? '' : adminFilter ? 'true' : 'false'}
            onChange={(e) => {
              if (e.target.value === '') setAdminFilter('');
              else setAdminFilter(e.target.value === 'true');
            }}
            className="w-full border rounded-md p-2 pl-10 appearance-none"
            title="Lọc theo chức vụ"
          >
            <option value="">Tất cả chức vụ</option>
            <option value="true">Quản Trị Viên</option>
            <option value="false">Người Dùng</option>
          </select>
          <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Bảng người dùng */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell" onClick={() => handleSort('_id')}>
                ID {getSortIcon('_id')}
              </th>
              <th scope="col" className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                Tên Người Dùng {getSortIcon('name')}
              </th>
              <th scope="col" className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                Email {getSortIcon('email')}
              </th>
              <th scope="col" className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Số Điện Thoại
              </th>
              <th scope="col" className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('isAdmin')}>
                Chức Vụ {getSortIcon('isAdmin')}
              </th>
              <th scope="col" className="px-2 py-2 md:px-6 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-2 py-2 md:px-6 md:py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-2 py-2 md:px-6 md:py-4 text-center text-xs text-gray-500">
                  Không tìm thấy người dùng nào
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-xs md:text-sm text-gray-900">{user._id.substring(user._id.length - 5)}</div>
                  </td>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap">
                    <div className="text-xs md:text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap">
                    <div className="text-xs md:text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-xs md:text-sm text-gray-500">
                      {user.phone && user.phone.trim() !== '' ? user.phone : 'N/A'}
                    </div>
                  </td>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isAdmin ? 'Quản Trị Viên' : 'Người dùng'}
                    </span>
                  </td>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap text-right text-xs md:text-sm font-medium">
                    <button
                      onClick={() => handleViewUserDetail(user._id)}
                      className="px-3 py-1 text-blue-600 hover:text-blue-800 mr-2 cursor-pointer"
                      title="Xem chi tiết"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={user.isAdmin || loading}
                      className={`px-3 py-1 rounded-md text-xs text-white 
                        ${user.isAdmin ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 cursor-pointer'}`}
                      title={user.isAdmin ? 'Không thể xóa tài khoản Admin' : 'Xóa người dùng'}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
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
              onClick={() => fetchUsers(currentPage - 1)}
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
                onClick={() => fetchUsers(page)}
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
              onClick={() => fetchUsers(currentPage + 1)}
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

      {/* Modal xem chi tiết user */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-auto backdrop-blur-sm bg-white/30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Thông tin chi tiết người dùng</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Họ tên</label>
                  <p className="text-base">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="text-base">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
                  <p className="text-base">{selectedUser.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Địa chỉ</label>
                  <p className="text-base">{selectedUser.address || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Vai trò</label>
                  <p className="text-base">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedUser.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedUser.isAdmin ? 'Quản Trị Viên' : 'Người dùng'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Ngày tạo tài khoản</label>
                  <p className="text-base">{new Date(selectedUser.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Users; 