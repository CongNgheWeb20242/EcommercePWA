import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { Navigate } from 'react-router-dom';
import { axiosInstance } from '../../config/axios';

// Dữ liệu mẫu cứng để hiển thị khi API lỗi hoặc không có dữ liệu
const DEFAULT_DATA = {
  users: [{ _id: null, numUsers: 120 }],
  orders: [{ _id: null, numOrders: 250, totalSales: 32500000 }],
  dailyOrders: [
    { _id: '2023-12-01', orders: 5, sales: 1500000 },
    { _id: '2023-12-02', orders: 8, sales: 2200000 },
    { _id: '2023-12-03', orders: 12, sales: 3800000 },
    { _id: '2023-12-04', orders: 6, sales: 1800000 },
    { _id: '2023-12-05', orders: 10, sales: 2500000 },
    { _id: '2023-12-06', orders: 15, sales: 4200000 },
    { _id: '2023-12-07', orders: 9, sales: 2700000 }
  ],
  productCategories: [
    { _id: 'Giày Nam', count: 25 },
    { _id: 'Giày Nữ', count: 18 },
    { _id: 'Giày Trẻ Em', count: 12 },
    { _id: 'Phụ Kiện', count: 8 }
  ]
};

// Card thống kê đơn giản
interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard = ({ title, value }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <p className="text-gray-500 text-sm font-medium">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const Revenue = () => {
  const { user: currentUser } = useUserStore();
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  
  // Kiểm tra quyền admin
  useEffect(() => {
    console.log("Kiểm tra quyền admin:", currentUser);
    if (!currentUser || !currentUser.isAdmin) {
      setRedirectToHome(true);
    }
  }, [currentUser]);

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/orders/summary');
        console.log('API Response:', response.data);
        
        if (response.data && 
            response.data.users && 
            response.data.orders && 
            response.data.dailyOrders &&
            response.data.productCategories) {
          setData(response.data);
          setUsingMockData(false);
        } else {
          console.log('API response không đúng định dạng, sử dụng dữ liệu mẫu');
          setData(DEFAULT_DATA);
          setUsingMockData(true);
        }
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        setError('Không thể lấy dữ liệu từ server, hiển thị dữ liệu mẫu');
        setData(DEFAULT_DATA);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchData();
    }
  }, [currentUser]);

  // Chuyển hướng nếu không phải admin
  if (redirectToHome) {
    console.log("Không phải admin, chuyển hướng về trang chủ");
    return <Navigate to="/" replace />;
  }
  
  // Tính toán các chỉ số
  const totalUsers = data.users && data.users[0] ? data.users[0].numUsers : 0;
  const totalOrders = data.orders && data.orders[0] ? data.orders[0].numOrders : 0; 
  const totalSales = data.orders && data.orders[0] ? data.orders[0].totalSales : 0;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý Doanh Thu</h1>
      
      {loading && (
        <div className="p-4 mb-6 bg-blue-100 text-blue-700 rounded-md">
          <p>⏳ Đang tải dữ liệu...</p>
        </div>
      )}
      
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">
          <p>⚠️ {error}</p>
        </div>
      )}
      
      {usingMockData && !loading && (
        <div className="p-4 mb-6 bg-blue-100 text-blue-700 rounded-md">
          <p>⚠️ Đang hiển thị dữ liệu mẫu. Dữ liệu thực tế sẽ được hiển thị khi API hoạt động.</p>
        </div>
      )}
      
      {/* Các thẻ thống kê chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Tổng doanh thu" 
          value={`${totalSales.toLocaleString()} đ`} 
        />
        <StatCard 
          title="Giá trị trung bình/đơn hàng" 
          value={`${averageOrderValue.toLocaleString()} đ`} 
        />
        <StatCard 
          title="Tổng số đơn hàng" 
          value={totalOrders.toLocaleString()} 
        />
        <StatCard 
          title="Tổng số khách hàng" 
          value={totalUsers.toLocaleString()} 
        />
      </div>

      {/* Bảng danh mục sản phẩm */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium mb-4">Phân bố danh mục sản phẩm</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b">
                <th className="pb-3">Danh mục</th>
                <th className="pb-3">Số lượng sản phẩm</th>
              </tr>
            </thead>
            <tbody>
              {data.productCategories && data.productCategories.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">{item._id}</td>
                  <td className="py-3">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Bảng doanh thu gần đây */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Doanh thu gần đây</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b">
                <th className="pb-3">Ngày</th>
                <th className="pb-3">Số đơn hàng</th>
                <th className="pb-3">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {data.dailyOrders && data.dailyOrders.map((item, index) => {
                const date = new Date(item._id);
                return (
                  <tr key={index} className="border-b">
                    <td className="py-3">{date.toLocaleDateString('vi-VN')}</td>
                    <td className="py-3">{item.orders}</td>
                    <td className="py-3">{item.sales.toLocaleString()} đ</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
