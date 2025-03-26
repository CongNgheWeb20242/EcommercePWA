import { Link, useLocation } from 'react-router-dom';

// Định nghĩa các menu item
const menuItems = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/products', label: 'Quản lý sản phẩm' },
  { path: '/admin/orders', label: 'Quản lý đơn hàng' },
  { path: '/admin/customers', label: 'Quản lý người dùng ' },
  { path: '/admin/revenue', label: 'Quản lý doanh thu' },
  { path: '/admin/settings', label: 'Cài đặt' },
];

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="w-64 bg-white border-r h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b">
        <Link to="/admin" className="text-xl font-bold text-gray-800">Shop Admin</Link>
      </div>
      
      {/* Menu Items */}
      <nav className="mt-6 px-4">
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
    </div>
  );
};

export default Sidebar;