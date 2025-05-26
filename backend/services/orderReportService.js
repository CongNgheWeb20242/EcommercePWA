import Order from '../models/orderModel.js';

export async function getOrderReport({ from, to }) {
  const match = {};
  if (from && to) {
    match.createdAt = { $gte: new Date(from), $lte: new Date(to) };
  }

  // Aggregate daily statistics
  const dailyStats = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        orderCount: { $sum: 1 },
        revenue: { $sum: "$totalPrice" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Calculate total orders and revenue
  const totalOrders = dailyStats.reduce((sum, d) => sum + d.orderCount, 0);
  const totalRevenue = dailyStats.reduce((sum, d) => sum + d.revenue, 0);

  return {
    totalOrders,
    totalRevenue,
    dailyStats: dailyStats.map(d => ({
      date: d._id,
      orderCount: d.orderCount,
      revenue: d.revenue
    }))
  };
}