// Dữ liệu giả cho sản phẩm
export const mockProducts = [
    {
      id: '1',
      name: 'Laptop Gaming Acer Nitro 5',
      category: 'Laptop',
      price: 999.99,
      stock: 15,
      image: 'https://via.placeholder.com/150',
      description: 'Laptop gaming mạnh mẽ với GPU NVIDIA',
      createdAt: '2023-03-15T08:00:00.000Z',
    },
    {
      id: '2',
      name: 'iPhone 14 Pro Max',
      category: 'Điện thoại',
      price: 1299.99,
      stock: 10,
      image: 'https://via.placeholder.com/150',
      description: 'iPhone mới nhất với camera cải tiến',
      createdAt: '2023-03-10T10:30:00.000Z',
    },
    {
      id: '3',
      name: 'Tai nghe Sony WH-1000XM4',
      category: 'Âm thanh',
      price: 349.99,
      stock: 8,
      image: 'https://via.placeholder.com/150',
      description: 'Tai nghe chống ồn cao cấp',
      createdAt: '2023-03-05T09:15:00.000Z',
    },
    {
      id: '4',
      name: 'Samsung Galaxy S23 Ultra',
      category: 'Điện thoại',
      price: 1199.99,
      stock: 7,
      image: 'https://via.placeholder.com/150',
      description: 'Điện thoại Samsung cao cấp nhất',
      createdAt: '2023-02-28T14:20:00.000Z',
    },
    {
      id: '5',
      name: 'iPad Pro M2',
      category: 'Máy tính bảng',
      price: 899.99,
      stock: 12,
      image: 'https://via.placeholder.com/150',
      description: 'iPad mạnh mẽ với chip M2',
      createdAt: '2023-02-20T11:45:00.000Z',
    },
  ];
  
  // Dữ liệu giả cho đơn hàng
  export const mockOrders = [
    {
      id: '1001',
      customer: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      date: '2023-04-12T08:30:00.000Z',
      status: 'completed',
      total: 120.00,
      items: [
        { id: '1', name: 'Laptop Gaming Acer Nitro 5', quantity: 1, price: 999.99 }
      ],
      shippingAddress: {
        address: '123 Đường Nguyễn Trãi',
        city: 'Hà Nội',
        postalCode: '100000',
        country: 'Việt Nam'
      },
      paymentMethod: 'COD'
    },
    {
      id: '1002',
      customer: 'Trần Thị B',
      email: 'tranthib@example.com',
      date: '2023-04-11T10:15:00.000Z',
      status: 'processing',
      total: 75.50,
      items: [
        { id: '3', name: 'Tai nghe Sony WH-1000XM4', quantity: 1, price: 349.99 }
      ],
      shippingAddress: {
        address: '456 Đường Lê Lợi',
        city: 'Hồ Chí Minh',
        postalCode: '700000',
        country: 'Việt Nam'
      },
      paymentMethod: 'Credit Card'
    },
    {
      id: '1003',
      customer: 'Lê Văn C',
      email: 'levanc@example.com',
      date: '2023-04-10T09:45:00.000Z',
      status: 'pending',
      total: 246.00,
      items: [
        { id: '2', name: 'iPhone 14 Pro Max', quantity: 1, price: 1299.99 }
      ],
      shippingAddress: {
        address: '789 Đường Trần Phú',
        city: 'Đà Nẵng',
        postalCode: '550000',
        country: 'Việt Nam'
      },
      paymentMethod: 'Momo'
    },
    {
      id: '1004',
      customer: 'Phạm Thị D',
      email: 'phamthid@example.com',
      date: '2023-04-09T14:20:00.000Z',
      status: 'completed',
      total: 189.25,
      items: [
        { id: '4', name: 'Samsung Galaxy S23 Ultra', quantity: 1, price: 1199.99 }
      ],
      shippingAddress: {
        address: '101 Đường Hùng Vương',
        city: 'Hải Phòng',
        postalCode: '180000',
        country: 'Việt Nam'
      },
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '1005',
      customer: 'Hoàng Văn E',
      email: 'hoangvane@example.com',
      date: '2023-04-08T11:30:00.000Z',
      status: 'processing',
      total: 145.75,
      items: [
        { id: '5', name: 'iPad Pro M2', quantity: 1, price: 899.99 }
      ],
      shippingAddress: {
        address: '202 Đường Trần Hưng Đạo',
        city: 'Cần Thơ',
        postalCode: '900000',
        country: 'Việt Nam'
      },
      paymentMethod: 'COD'
    }
  ];
  
  // Dữ liệu giả cho khách hàng
  export const mockCustomers = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      totalOrders: 5,
      totalSpent: 1245.75,
      createdAt: '2023-01-15T08:30:00.000Z'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0912345678',
      totalOrders: 3,
      totalSpent: 642.50,
      createdAt: '2023-01-20T10:15:00.000Z'
    },
    {
      id: '3',
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      phone: '0923456789',
      totalOrders: 2,
      totalSpent: 378.25,
      createdAt: '2023-02-05T09:45:00.000Z'
    },
    {
      id: '4',
      name: 'Phạm Thị D',
      email: 'phamthid@example.com',
      phone: '0934567890',
      totalOrders: 1,
      totalSpent: 189.25,
      createdAt: '2023-02-12T14:20:00.000Z'
    },
    {
      id: '5',
      name: 'Hoàng Văn E',
      email: 'hoangvane@example.com',
      phone: '0945678901',
      totalOrders: 4,
      totalSpent: 876.50,
      createdAt: '2023-01-10T11:30:00.000Z'
    }
  ];
  
  // Dữ liệu giả cho dashboard
  export const mockDashboardData = {
    totalSales: 12345.67,
    totalOrders: 123,
    totalProducts: 45,
    totalCustomers: 89,
    pendingOrders: 12,
    growthRate: 12.5,
    recentOrders: mockOrders.slice(0, 5),
    topProducts: [
      { id: '2', name: 'iPhone 14 Pro Max', sales: 25, revenue: 32499.75 },
      { id: '1', name: 'Laptop Gaming Acer Nitro 5', sales: 18, revenue: 17999.82 },
      { id: '4', name: 'Samsung Galaxy S23 Ultra', sales: 15, revenue: 17999.85 },
      { id: '3', name: 'Tai nghe Sony WH-1000XM4', sales: 12, revenue: 4199.88 },
      { id: '5', name: 'iPad Pro M2', sales: 10, revenue: 8999.90 }
    ]
  };
  // Thêm dữ liệu giả cho quản lý doanh thu
export const mockRevenueData = {
    // Doanh thu theo tháng
    monthlyRevenue: [
      { month: 'Tháng 1', revenue: 12500 },
      { month: 'Tháng 2', revenue: 14200 },
      { month: 'Tháng 3', revenue: 16800 },
      { month: 'Tháng 4', revenue: 15600 },
      { month: 'Tháng 5', revenue: 18200 },
      { month: 'Tháng 6', revenue: 17500 },
      { month: 'Tháng 7', revenue: 19800 },
      { month: 'Tháng 8', revenue: 22400 },
      { month: 'Tháng 9', revenue: 21500 },
      { month: 'Tháng 10', revenue: 23800 },
      { month: 'Tháng 11', revenue: 26500 },
      { month: 'Tháng 12', revenue: 29800 },
    ],
    
    // Doanh thu theo danh mục sản phẩm
    categoryRevenue: [
      { category: 'Điện thoại', revenue: 45600, percentage: 35 },
      { category: 'Laptop', revenue: 32400, percentage: 25 },
      { category: 'Máy tính bảng', revenue: 19500, percentage: 15 },
      { category: 'Phụ kiện', revenue: 13000, percentage: 10 },
      { category: 'Âm thanh', revenue: 11700, percentage: 9 },
      { category: 'Khác', revenue: 7800, percentage: 6 },
    ],
    
    // Top khách hàng theo doanh thu
    topCustomers: [
      { id: '1', name: 'Nguyễn Văn A', totalOrders: 12, totalSpent: 8450 },
      { id: '5', name: 'Hoàng Văn E', totalOrders: 8, totalSpent: 6720 },
      { id: '2', name: 'Trần Thị B', totalOrders: 6, totalSpent: 5890 },
      { id: '3', name: 'Lê Văn C', totalOrders: 5, totalSpent: 4350 },
      { id: '4', name: 'Phạm Thị D', totalOrders: 4, totalSpent: 3780 },
    ],
    
    // Tổng quan doanh thu
    revenueSummary: {
      totalRevenue: 238700,
      comparedToLastYear: 22.5, // Tăng 22.5% so với năm trước
      averageOrderValue: 145.8,
      totalOrders: 1637,
      totalCustomers: 892,
      revenuePerCustomer: 267.6
    }
  };