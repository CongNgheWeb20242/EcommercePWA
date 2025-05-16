import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface ApiResponse {
  users: User[];
  page: number;
  pages: number;
}

const UserCard = ({ 
  user,
  onEdit,
  onDelete,
  onToggleAdmin
}: { 
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onToggleAdmin: (id: string, isAdmin: boolean) => void;
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-lg">{user.name}</h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
          {user.isAdmin ? 'Quản trị viên' : 'Người dùng'}
        </span>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">
        Ngày tạo: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
      </p>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(user)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Sửa
        </button>
        <button
          onClick={() => onToggleAdmin(user._id, !user.isAdmin)}
          className={`px-3 py-1 rounded text-sm ${
            user.isAdmin 
              ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
              : 'bg-purple-500 text-white hover:bg-purple-600'
          }`}
        >
          {user.isAdmin ? 'Hủy quyền admin' : 'Cấp quyền admin'}
        </button>
        <button
          onClick={() => onDelete(user._id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

const UserForm = ({
  user,
  onSave,
  onCancel
}: {
  user?: User;
  onSave: (user: Partial<User>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Partial<User>>(user || {
    name: '',
    email: '',
    isAdmin: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tên</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          placeholder="Nhập tên người dùng"
          title="Tên người dùng"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          placeholder="Nhập email"
          title="Email người dùng"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.isAdmin || false}
          onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
          className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 h-4 w-4"
          id="is-admin"
        />
        <label htmlFor="is-admin" className="ml-2 block text-sm text-gray-700">
          Là quản trị viên
        </label>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdminOnly, setShowAdminOnly] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Gọi API để lấy dữ liệu người dùng
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get<ApiResponse>(
        `http://localhost:5000/api/users/admin?page=${page}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setUsers(data.users);
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
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAdminFilter = !showAdminOnly || user.isAdmin;
    return matchesSearch && matchesAdminFilter;
  });

  const handleAddUser = async (newUser: Partial<User>) => {
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/users',
        newUser,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchUsers();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Có lỗi xảy ra khi thêm người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (updatedUser: Partial<User>) => {
    if (!editingUser) return;
    
    const userId = editingUser._id;
    setLoading(true);
    
    try {
      await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        updatedUser,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      setEditingUser(null);
      fetchUsers();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Có lỗi xảy ra khi cập nhật người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      fetchUsers();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Có lỗi xảy ra khi xóa người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/users/${userId}/toggle-admin`,
        { isAdmin },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isAdmin } : user
      ));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Có lỗi xảy ra khi cập nhật quyền admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <button
          onClick={() => setEditingUser({} as User)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          Thêm người dùng
        </button>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Form thêm/sửa người dùng */}
      {editingUser && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">
            {editingUser._id ? 'Sửa người dùng' : 'Thêm người dùng mới'}
          </h2>
          <UserForm
            user={editingUser._id ? editingUser : undefined}
            onSave={editingUser._id ? handleEditUser : handleAddUser}
            onCancel={() => setEditingUser(null)}
          />
        </div>
      )}

      {/* Bộ lọc và tìm kiếm */}
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md flex-1"
          title="Tìm kiếm người dùng"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            id="admin-only"
            checked={showAdminOnly}
            onChange={(e) => setShowAdminOnly(e.target.checked)}
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 h-4 w-4"
          />
          <label htmlFor="admin-only" className="ml-2 text-sm text-gray-700">
            Chỉ hiển thị quản trị viên
          </label>
        </div>
      </div>

      {/* Hiển thị danh sách người dùng */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Không tìm thấy người dùng nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onEdit={setEditingUser}
                  onDelete={handleDeleteUser}
                  onToggleAdmin={handleToggleAdmin}
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
                  onClick={() => fetchUsers(page)}
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

export default Users; 