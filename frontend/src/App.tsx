import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import Dashboard from './pages/admin/Dashboard';
import Revenue from './pages/admin/Revenue'; 

import HomePage from './pages/user/HomePage';
import SignUp from './pages/user/SignUp';
import SignIn from './pages/user/SignIn';


const PlaceholderPage = ({ title }: { title: string }) => (
  <div>
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p>Trang đang được phát triển</p>
  </div>
);
 
const App = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout title="Dashboard"><Dashboard /></AdminLayout>} />
      <Route path="/admin/products" element={<AdminLayout title="Sản phẩm"><PlaceholderPage title="Quản lý sản phẩm" /></AdminLayout>} />
      <Route path="/admin/orders" element={<AdminLayout title="Đơn hàng"><PlaceholderPage title="Quản lý đơn hàng" /></AdminLayout>} />
      <Route path="/admin/customers" element={<AdminLayout title="Khách hàng"><PlaceholderPage title="Quản lý khách hàng" /></AdminLayout>} />
      <Route path="/admin/revenue" element={<AdminLayout title="Doanh thu"><Revenue /></AdminLayout>} /> {/* Thêm route mới */}
      <Route path="/admin/settings" element={<AdminLayout title="Cài đặt"><PlaceholderPage title="Cài đặt cửa hàng" /></AdminLayout>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout title="Dashboard"><Dashboard /></AdminLayout>} />

      {/* Redirect to admin dashboard */}
      <Route path="/user/home" element={<UserLayout><HomePage /></UserLayout>} />
      <Route path="/user/register" element={<UserLayout><SignUp /></UserLayout>} />
      <Route path="/user/login" element={<UserLayout><SignIn /></UserLayout>} />
    </Routes>
  );
};

export default App;