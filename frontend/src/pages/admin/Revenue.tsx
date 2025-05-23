import { mockRevenueData } from '../../data/mockData';

// Định nghĩa props cho component StatCard
interface StatCardProps {
  title: string;
  value: string | number;
  subText?: string;
  bgColor?: string;
}

// Component hiển thị thẻ thống kê đơn lẻ (ví dụ: Tổng doanh thu)
const StatCard = ({ title, value, subText, bgColor = 'bg-white' }: StatCardProps) => (
  <div className={`${bgColor} p-6 rounded-lg shadow-sm`}>
    <p className="text-gray-500 text-sm font-medium">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
    {subText && <p className="text-sm text-gray-500 mt-1">{subText}</p>}
  </div>
);

// Component biểu đồ cột hiển thị doanh thu theo từng tháng
const RevenueChart = () => {
  const { monthlyRevenue } = mockRevenueData;

  // Tìm doanh thu cao nhất để tính phần trăm chiều cao từng cột
  const maxRevenue = Math.max(...monthlyRevenue.map(item => item.revenue));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-lg font-medium mb-4">Doanh thu theo tháng</h2>

      {/* Biểu đồ dạng cột theo tỷ lệ phần trăm chiều cao */}
      <div className="flex items-end h-64 space-x-2">
        {monthlyRevenue.map((item, index) => {
          const heightPercentage = (item.revenue / maxRevenue) * 100;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${heightPercentage}%` }}
              ></div>
              <p className="text-xs mt-2 text-gray-600">{item.month.split(' ')[1]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Component bảng thống kê doanh thu theo danh mục sản phẩm
const CategoryRevenueTable = () => {
  const { categoryRevenue } = mockRevenueData;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-lg font-medium mb-4">Doanh thu theo danh mục</h2>

      {/* Bảng hiển thị danh mục, doanh thu và tỷ lệ phần trăm kèm thanh biểu diễn */}
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm font-medium text-gray-500 border-b">
            <th className="pb-3">Danh mục</th>
            <th className="pb-3">Doanh thu</th>
            <th className="pb-3">Tỷ lệ</th>
            <th className="pb-3">Biểu đồ</th>
          </tr>
        </thead>
        <tbody>
          {categoryRevenue.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-3">{item.category}</td>
              <td className="py-3">${item.revenue.toLocaleString()}</td>
              <td className="py-3">{item.percentage}%</td>
              <td className="py-3 w-1/3">
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Component hiển thị bảng top khách hàng theo tổng chi tiêu
const TopCustomersTable = () => {
  const { topCustomers } = mockRevenueData;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">Top khách hàng</h2>

      {/* Bảng danh sách khách hàng và thông tin liên quan */}
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm font-medium text-gray-500 border-b">
            <th className="pb-3">Khách hàng</th>
            <th className="pb-3">Số đơn hàng</th>
            <th className="pb-3">Tổng chi tiêu</th>
          </tr>
        </thead>
        <tbody>
          {topCustomers.map((customer, index) => (
            <tr key={index} className="border-b">
              <td className="py-3">{customer.name}</td>
              <td className="py-3">{customer.totalOrders}</td>
              <td className="py-3">${customer.totalSpent.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Component chính hiển thị toàn bộ trang quản lý doanh thu
const Revenue = () => {
  const { revenueSummary } = mockRevenueData;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Doanh Thu</h1>

      {/* Các thẻ thống kê chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Tổng doanh thu" 
          value={`$${revenueSummary.totalRevenue.toLocaleString()}`} 
          subText={`Tăng ${revenueSummary.comparedToLastYear}% so với năm trước`}
        />
        <StatCard 
          title="Giá trị trung bình/đơn hàng" 
          value={`$${revenueSummary.averageOrderValue}`} 
        />
        <StatCard 
          title="Tổng số đơn hàng" 
          value={revenueSummary.totalOrders.toLocaleString()} 
        />
        <StatCard 
          title="Tổng số khách hàng" 
          value={revenueSummary.totalCustomers.toLocaleString()} 
        />
        <StatCard 
          title="Doanh thu/khách hàng" 
          value={`$${revenueSummary.revenuePerCustomer}`} 
        />
        <StatCard 
          title="Đơn hàng/khách hàng" 
          value={(revenueSummary.totalOrders / revenueSummary.totalCustomers).toFixed(1)} 
        />
      </div>

      {/* Biểu đồ cột theo tháng */}
      <RevenueChart />

      {/* Bảng doanh thu theo danh mục và bảng top khách hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryRevenueTable />
        <TopCustomersTable />
      </div>
    </div>
  );
};

export default Revenue;
