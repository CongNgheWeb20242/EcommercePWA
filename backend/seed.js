import mongoose from 'mongoose';
import dotenv from 'dotenv';
import data from './data.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('Current Working Directory:', process.cwd()); // Debugging log
    console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debugging log
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Product.deleteMany({});

    const createdUsers = await User.insertMany(data.users);
    const createdProducts = await Product.insertMany(data.products);

    console.log('Sample data seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error.message);
    mongoose.connection.close();
  }
};

seedData();
