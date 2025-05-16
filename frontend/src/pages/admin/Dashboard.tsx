// Import các hook và thành phần cần thiết từ React và thư viện Recharts
import { useState } from 'react';
import { mockDashboardData, mockRevenueData } from '../../data/mockData';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// Mảng màu sắc dùng để tô các phần trong biểu đồ tròn
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Hàm trả về dữ liệu doanh thu tương ứng với khoảng thời gian được chọn (tháng, quý, năm)
const getRevenueData = (timeRange: string) => {
  switch (timeRange) {
    case 'month':
      return mockRevenueData.monthlyRevenue;
    case 'quarter':
      return [
        { quarter: 'Q1', revenue: 43500 },
        { quarter: 'Q2', revenue: 51300 },
        { quarter: 'Q3', revenue: 63700 },
        { quarter: 'Q4', revenue: 80200 }
      ];
    case 'year':
      return [
        { year: '2021', revenue: 238700 },
        { year: '2022', revenue: 312500 },
        { year: '2023', revenue: 425800 }
      ];
    default:
      return mockRevenueData.monthlyRevenue;
  }
};

const Dashboard = () => {
  // State quản lý khoảng thời gian được chọn và trạng thái loading
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý khi thay đổi khoảng thời gian (tháng, quý, năm)
  const handleTimeRangeChange = (value: string) => {
    setIsLoading(true); // Hiển thị loading trong lúc chờ dữ liệu
    setTimeRange(value);
    setTimeout(() => setIsLoading(false), 500); // Giả lập delay tải dữ liệu
  };

  return (
    <div className="space-y-6">
      {/* Phần thống kê tổng quan (doanh thu, đơn hàng, sản phẩm, tăng trưởng) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-gray-500 text-sm">Tổng doanh thu</h3>
          <p className="text-2xl font-bold">${mockDashboardData.totalSales.toLocaleString()}</p>
          <p className="text-green-500 text-sm">+{mockDashboardData.growthRate}% so với tháng trước</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-gray-500 text-sm">Tổng đơn hàng</h3>
          <p className="text-2xl font-bold">{mockDashboardData.totalOrders}</p>
          <p className="text-gray-500 text-sm">{mockDashboardData.pendingOrders} đơn đang chờ xử lý</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-gray-500 text-sm">Tổng sản phẩm</h3>
          <p className="text-2xl font-bold">{mockDashboardData.totalProducts}</p>
          <p className="text-gray-500 text-sm">{mockDashboardData.totalCustomers} khách hàng</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-gray-500 text-sm">Tỷ lệ tăng trưởng</h3>
          <p className="text-2xl font-bold">{mockDashboardData.growthRate}%</p>
          <p className="text-green-500 text-sm">Tăng trưởng tích cực</p>
        </div>
      </div>

      {/* Biểu đồ doanh thu theo khoảng thời gian đã chọn */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Doanh thu theo {timeRange === 'month' ? 'tháng' : timeRange === 'quarter' ? 'quý' : 'năm'}
          </h2>
          <select 
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="px-3 py-1 border rounded-md"
            title="Chọn khoảng thời gian"
            aria-label="Chọn khoảng thời gian"
          >
            <option value="month">Theo tháng</option>
            <option value="quarter">Theo quý</option>
            <option value="year">Theo năm</option>
          </select>
        </div>
        <div className="h-80 relative">
          {isLoading ? (
            // Hiển thị vòng quay khi đang tải dữ liệu
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            // Biểu đồ cột thể hiện doanh thu theo tháng, quý hoặc năm
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getRevenueData(timeRange)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeRange === 'month' ? 'month' : timeRange === 'quarter' ? 'quarter' : 'year'} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ tròn thể hiện doanh thu theo từng loại sản phẩm */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Phân loại sản phẩm</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockRevenueData.categoryRevenue}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {mockRevenueData.categoryRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Danh sách top 5 sản phẩm bán chạy nhất */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Top 5 sản phẩm bán chạy</h2>
          <div className="space-y-4">
            {mockDashboardData.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">{index + 1}.</span>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} đơn bán</p>
                  </div>
                </div>
                <span className="font-bold">${product.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danh sách top 5 khách hàng mua nhiều nhất */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Top 5 khách hàng</h2>
        <div className="space-y-4">
          {mockRevenueData.topCustomers.map((customer, index) => (
            <div key={customer.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <span className="text-gray-500">{index + 1}.</span>
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-500">{customer.totalOrders} đơn hàng</p>
                </div>
              </div>
              <span className="font-bold">${customer.totalSpent.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
