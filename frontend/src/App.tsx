import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import Dashboard from './pages/admin/Dashboard';
import Revenue from './pages/admin/Revenue';

import HomePage from './pages/user/HomePage';
import SignUp from './pages/user/SignUp';
import SignIn from './pages/user/SignIn';
import Products from './pages/user/Products';
import Product from './pages/user/Product';
import Cart from './pages/user/Cart';
import CheckOut from './pages/user/CheckOut';


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
      <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
      <Route path="/home" element={<UserLayout><HomePage /></UserLayout>} />
      <Route path="/user/register" element={<UserLayout><SignUp /></UserLayout>} />
      <Route path="/user/login" element={<UserLayout><SignIn /></UserLayout>} />
      <Route path="/user/products" element={<UserLayout><Products searchText={'Tất cả sản phẩm'} /></UserLayout>} />
      <Route path="/user/product/:id" element={<UserLayout><Product /></UserLayout>} />
      <Route path="/user/cart" element={<UserLayout><Cart /></UserLayout>} />
      <Route path="/user/checkout" element={<UserLayout><CheckOut /></UserLayout>} />
    </Routes>
  );
};

export default App;
// import './App.css';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import PaymentReturn from './test/PaymentReturn';

// // Tạo component Home đơn giản với nút thanh toán test
// const Home = () => {
//   const handleTestPayment = async () => {
//     // Tạo đơn hàng test
//     const testOrder = {
//       _id: Date.now().toString(), // Tạo ID unique
//       totalPrice: 10000, // 10,000 VND
//       orderItems: [
//         {
//           product: 'test-product',
//           quantity: 1,
//           price: 10000
//         }
//       ],
//       shippingAddress: {
//         fullName: 'Test User',
//         address: '123 Test St',
//         city: 'Hanoi',
//         country: 'Vietnam'
//       },
//       paymentMethod: 'vnpay'
//     };

//     try {
//       const response = await fetch('/api/payment/create_payment_url', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           order: testOrder,
//           // Thêm các thông tin cần thiết cho VNPay
//           orderType: '250000', // Mã danh mục hàng hóa
//           orderDescription: `Thanh toan don hang ${testOrder._id}`,
//           language: 'vn'
//         }),
//       });

//       const data = await response.json();

//       if (data.code === '00' && data.data) {
//         // Log URL thanh toán để debug
//         console.log('Payment URL:', data.data);

//         // Chuyển hướng đến trang thanh toán VNPay
//         window.location.href = data.data;
//       } else {
//         alert('Có lỗi khi tạo URL thanh toán: ' + data.message);
//       }
//     } catch (error) {
//       console.error('Payment Error:', error);
//       alert('Có lỗi xảy ra khi kết nối với server');
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col justify-center items-center">
//       <h1 className="text-2xl font-bold mb-4">Test VNPay Payment</h1>
//       <div className="space-y-4">
//         <div className="text-center">
//           <p className="text-gray-600 mb-2">Số tiền test: 10,000 VNĐ</p>
//           <button
//             onClick={handleTestPayment}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Thanh toán với VNPay
//           </button>
//         </div>

//         {/* Thêm thông tin test */}
//         <div className="mt-8 p-4 bg-gray-100 rounded">
//           <h2 className="font-semibold mb-2">Thông tin thẻ test:</h2>
//           <ul className="text-sm space-y-1">
//             <li>Ngân hàng: NCB</li>
//             <li>Số thẻ: 9704198526191432198</li>
//             <li>Tên chủ thẻ: NGUYEN VAN A</li>
//             <li>Ngày phát hành: 07/15</li>
//             <li>OTP: 123456</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/payment/vnpay_return" element={<PaymentReturn />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;
