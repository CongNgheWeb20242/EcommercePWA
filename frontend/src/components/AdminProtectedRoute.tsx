import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user } = useUserStore();

  if (!user) {
    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    return <Navigate to="/user/login" replace />;
  }

  if (!user.isAdmin) {
    // Nếu không phải admin, chuyển hướng về trang chủ
    return <Navigate to="/home" replace />;
  }

  // Nếu là admin, hiển thị nội dung
  return <>{children}</>;
};

export default AdminProtectedRoute; 