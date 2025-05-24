import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { useState } from 'react';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

// Định nghĩa các menu item
const menuItems = [
  { path: '/admin/products', label: 'Quản lý sản phẩm' },
  { path: '/admin/orders', label: 'Quản lý đơn hàng' },
  { path: '/admin/users', label: 'Quản lý người dùng' },
  { path: '/admin/revenue', label: 'Quản lý doanh thu' },
];

// Component hộp thoại xác nhận
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[9999]">
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

const Sidebar = ({ open = false, onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUserStore();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const handleLogout = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Đăng xuất',
      message: 'Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị không?',
      onConfirm: () => {
        logout();
        navigate('/user/login');
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Responsive: ẩn trên mobile, hiện dạng drawer khi open=true
  return (
    <aside
      className={`
        fixed z-50 md:static md:translate-x-0 top-0 left-0 h-full w-64 bg-white border-r flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
      style={{ minWidth: 256 }}
    >
      {/* Nút đóng trên mobile */}
      <div className="flex items-center justify-between h-16 border-b px-4">
        <span className="text-xl font-bold text-gray-800">Shop Admin</span>
        <button
          className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
          aria-label="Đóng menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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
                onClick={onClose}
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
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </aside>
  );
};

export default Sidebar;