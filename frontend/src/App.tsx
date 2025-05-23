import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Revenue from './pages/admin/Revenue';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';

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
      <Route path="/admin/products" element={<AdminLayout title="Sản phẩm"><Products /></AdminLayout>} />
      <Route path="/admin/orders" element={<AdminLayout title="Đơn hàng"><Orders /></AdminLayout>} />
      <Route path="/admin/users" element={<AdminLayout title="Người dùng"><Users /></AdminLayout>} />
      <Route path="/admin/revenue" element={<AdminLayout title="Doanh thu"><Revenue /></AdminLayout>} />
      <Route path="/admin/settings" element={<AdminLayout title="Cài đặt"><PlaceholderPage title="Cài đặt cửa hàng" /></AdminLayout>} />
      
      {/* Redirect to admin dashboard */}
      <Route path="/" element={<AdminLayout title="Dashboard"><Dashboard /></AdminLayout>} />
    </Routes>
  );
};

export default App;