import { mockDashboardData } from '../../data/mockData';

// Component Card thống kê
interface StatCardProps {
  title: string;
  value: string | number;
  bgColor?: string;
}

const StatCard = ({ title, value, bgColor = 'bg-white' }: StatCardProps) => (
  <div className={`${bgColor} p-6 rounded-lg shadow-sm`}>
    <p className="text-gray-500 text-sm font-medium">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

// Component hàng trong bảng đơn hàng
interface OrderRowProps {
  id: string;
  customer: string;
  date: string;
  status: string;
  total: number;
}

const OrderRow = ({ id, customer, date, status, total }: OrderRowProps) => {
  const statusColor = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
  }[status] || 'bg-gray-100 text-gray-800';

  return (
    <tr className="border-b">
      <td className="py-3 px-4 text-sm">#{id}</td>
      <td className="py-3 px-4 text-sm">{customer}</td>
      <td className="py-3 px-4 text-sm">{new Date(date).toLocaleDateString()}</td>
      <td className="py-3 px-4 text-sm">
        <span className={`inline-block px-2 py-1 rounded-full text-xs ${statusColor}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="py-3 px-4 text-sm font-medium">${total.toFixed(2)}</td>
    </tr>
  );
};

const Dashboard = () => {
  const {
    totalSales,
    totalOrders,
    totalProducts,
    totalCustomers,
    pendingOrders,
    growthRate,
    recentOrders,
  } = mockDashboardData;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard title="Tổng doanh thu" value={`$${totalSales.toLocaleString()}`} />
        <StatCard title="Đơn hàng" value={totalOrders} />
        <StatCard title="Sản phẩm" value={totalProducts} />
        <StatCard title="Khách hàng" value={totalCustomers} />
        <StatCard title="Đơn hàng đang xử lý" value={pendingOrders} />
        <StatCard title="Tăng trưởng" value={`${growthRate}%`} />
      </div>
      
      {/* Đơn hàng gần đây */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium mb-4">Đơn hàng gần đây</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Ngày</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  id={order.id}
                  customer={order.customer}
                  date={order.date}
                  status={order.status}
                  total={order.total}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;