import { ReactNode, useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import { useUserStore } from '@/store/userStore';
import ChatAdmin from '../pages/admin/ChatAdmin';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout = ({ children, title = "Dashboard" }: AdminLayoutProps) => {
  const { user } = useUserStore();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar responsive */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Overlay khi sidebar mở trên mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-6">
          {/* Nút mở sidebar trên mobile */}
          <button
            className="md:hidden mr-2 text-gray-700 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Mở menu quản trị"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-medium truncate">{title}</h1>
          {/* User Profile */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {userInitial}
            </div>
            <span className="ml-2 font-medium text-sm truncate max-w-[100px]">{user?.name || 'Admin User'}</span>
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
          {children}
        </main>
        {/* ChatAdmin widget nổi ở góc phải dưới */}
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
          <ChatAdmin />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;