import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

interface UserProtectedRouteProps {
  children: React.ReactNode;
}

const UserProtectedRoute = ({ children }: UserProtectedRouteProps) => {
  const { user } = useUserStore();

  if (!user) {
    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    return <Navigate to="/user/login" replace />;
  }

  // Nếu đã đăng nhập, hiển thị nội dung
  return <>{children}</>;
};

export default UserProtectedRoute; 