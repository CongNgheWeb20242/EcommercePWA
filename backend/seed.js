import { connectDB } from './lib/db.js';

import User from './models/userModel.js';
import Category from './models/categoryModel.js';
import Order from './models/orderModel.js';
import Product from './models/productModel.js';
import Review from './models/reviewModel.js';

const seedData = async () => {
  try {
    await connectDB();

    // Xoá data cũ
    await User.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();

    // Categorie mẫu
    const categories = await Category.insertMany([
      { name: "Men's Clothing", description: 'Clothes for men' },
      { name: "Women's Clothing", description: 'Clothes for women' },
      { name: 'Accessories', description: 'Fashion accessories' },
    ]);

    // User mẫu
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: '123456',
        isAdmin: true,
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        isAdmin: false,
      },
      {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123@',
        isAdmin: false,
      },
    ]);

    // Product mẫu
    const products = await Product.insertMany([
      {
        name: "Men's T-Shirt",
        slug: 'mens-t-shirt',
        // Chưa có ảnh
        image: 'tshirt1.jpg',
        images: ['tshirt1_1.jpg', 'tshirt1_2.jpg'],
        brand: 'Nike',
        category: categories[0]._id,
        description: "High quality men's t-shirt",
        price: 19.99,
        countInStock: 50,
        rating: 4.5,
        numReviews: 10,
        reviews: [],
      },
      {
        name: "Women's Dress",
        slug: 'womens-dress',
        image: 'dress1.jpg',
        images: ['dress1_1.jpg', 'dress1_2.jpg'],
        brand: 'Zara',
        category: categories[1]._id,
        description: "Stylish women's dress",
        price: 39.99,
        countInStock: 30,
        rating: 4.7,
        numReviews: 8,
        reviews: [],
      },
    ]);

    // Review mẫu
    const reviews = await Review.insertMany([
      {
        userId: users[1]._id,
        rating: 5,
        comment: 'Great quality!',
        product: products[0]._id,
      },
      {
        userId: users[1]._id,
        rating: 4,
        comment: 'Nice design!',
        product: products[1]._id,
      },
    ]);

    // Order mẫu
    await Order.insertMany([
      {
        orderItems: [
          {
            name: products[0].name,
            quantity: 2,
            image: products[0].image,
            price: products[0].price,
            product: products[0]._id,
          },
        ],
        shippingAddress: {
          fullName: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          postalCode: '10001',
          country: 'USA',
        },
        paymentMethod: 'VNPAY',
        itemsPrice: 39.98,
        shippingPrice: 5.0,
        taxPrice: 2.0,
        totalPrice: 46.98,
        user: users[1]._id,
        isPaid: true,
        paidAt: new Date(),
      },
    ]);
    console.log('Data seeded Successfully!!');
    process.exit();
  } catch (error) {
    console.error('Seed error:', error);
  }
};

seedData();
