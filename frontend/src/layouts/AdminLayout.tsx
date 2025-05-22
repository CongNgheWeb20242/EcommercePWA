import { ReactNode } from 'react';
import Sidebar from '../components/admin/Sidebar';
import { useUserStore } from '@/store/userStore';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout = ({ children, title = "Dashboard" }: AdminLayoutProps) => {
  const { user } = useUserStore();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h1 className="text-lg font-medium">{title}</h1>
          
          {/* User Profile */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {userInitial}
            </div>
            <span className="ml-2 font-medium text-sm">{user?.name || 'Admin User'}</span>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;