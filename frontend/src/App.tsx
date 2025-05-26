import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import Revenue from './pages/admin/Revenue';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';
import PaymentReturn from './test/PaymentReturn';
import './App.css';
import { Toaster } from 'react-hot-toast';

// User pages
import HomePage from './pages/user/HomePage';
import SignUp from './pages/user/SignUp';
import SignIn from './pages/user/SignIn';
import ProfilePage from './pages/user/ProfilePage';
import UserProducts from './pages/user/Products';
import Product from './pages/user/Product';
import Cart from './pages/user/Cart';
import CheckOut from './pages/user/CheckOut';

// Protected Routes
import AdminProtectedRoute from './components/AdminProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';

const App = () => {
  return (
    <>
      <Routes>
        {/* Admin Routes - Được bảo vệ bởi AdminProtectedRoute */}
        <Route path="/admin/products" element={
          <AdminProtectedRoute>
            <AdminLayout title="Sản phẩm"><Products /></AdminLayout>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminProtectedRoute>
            <AdminLayout title="Đơn hàng"><Orders /></AdminLayout>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <AdminProtectedRoute>
            <AdminLayout title="Người dùng"><Users /></AdminLayout>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/revenue" element={
          <AdminProtectedRoute>
            <AdminLayout title="Doanh thu"><Revenue /></AdminLayout>
          </AdminProtectedRoute>
        } />

        {/* Public User Routes - Không yêu cầu đăng nhập */}
        <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
        <Route path="/home" element={<UserLayout><HomePage /></UserLayout>} />
        <Route path="/user/register" element={<UserLayout><SignUp /></UserLayout>} />
        <Route path="/user/login" element={<UserLayout><SignIn /></UserLayout>} />
        <Route path="/user/profile" element={<UserLayout><ProfilePage /></UserLayout>} />

        <Route path="/user/products" element={<UserLayout><UserProducts key={'Tất Cả Sản Phẩm'} searchText={'Tất Cả Sản Phẩm'} /></UserLayout>} />
        <Route path="/user/products/men" element={<UserLayout><UserProducts key={'Thời Trang Nam'} searchText={'Thời Trang Nam'} /></UserLayout>} />
        <Route path="/user/products/women" element={<UserLayout><UserProducts key={'Thời Trang Nữ'} searchText={'Thời Trang Nữ'} /></UserLayout>} />
        <Route path="/user/product/:id" element={<UserLayout><Product /></UserLayout>} />
        <Route path="/user/cart" element={<UserLayout><Cart /></UserLayout>} />
        <Route path="/user/checkout" element={<UserLayout><CheckOut /></UserLayout>} />

        {/* Protected User Routes - Yêu cầu đăng nhập */}
        <Route path="/user/cart" element={
          <UserProtectedRoute>
            <UserLayout><Cart /></UserLayout>
          </UserProtectedRoute>
        } />
        <Route path="/user/checkout" element={
          <UserProtectedRoute>
            <UserLayout><CheckOut /></UserLayout>
          </UserProtectedRoute>
        } />

        {/* Payment Routes */}
        <Route path="/payment/vnpay_return" element={<PaymentReturn />} />

        {/* Redirect trang chủ về home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
