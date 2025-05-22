import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

// Định nghĩa các menu item
const menuItems = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/products', label: 'Quản lý sản phẩm' },
  { path: '/admin/orders', label: 'Quản lý đơn hàng' },
  { path: '/admin/users', label: 'Quản lý người dùng' },
  { path: '/admin/revenue', label: 'Quản lý doanh thu' },
  { path: '/admin/settings', label: 'Cài đặt' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUserStore();
  
  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };
  
  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b">
        <Link to="/admin" className="text-xl font-bold text-gray-800">Shop Admin</Link>
      </div>
      
      {/* Menu Items */}
      <nav className="mt-6 px-4 flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Logout Button */}
      <div className="p-4 border-t">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
        >
          <span className="ml-3">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;