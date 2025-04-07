import dotenv from 'dotenv';
import Category from '../models/categoryModel.js';
import {connectDB} from '../lib/db.js'

dotenv.config();

// Sample category data
const categories = [
  { name: 'Electronics', description: 'Devices and gadgets.' },
  { name: 'Clothing', description: 'Men and Women Clothing.' },
  { name: 'Home Appliances', description: 'Kitchen and home appliances.' },
  { name: 'Toys', description: 'Toys for kids.' },
  { name: 'Books', description: 'Fiction, non-fiction, and more.' },
];

// Function to seed categories
const seedCategories = async () => {
  try {
    await connectDB(); // Ensure the connection is made first

    // Delete all existing categories before seeding new data
    await Category.deleteMany();

    // Insert the sample categories
    await Category.insertMany(categories);
    console.log('Categories seeded successfully');

    process.exit(); // Exit the process after seeding
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedCategories();
