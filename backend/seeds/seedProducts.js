
import Product from '../models/productModel.js'; // Import the Product model
import Category from '../models/categoryModel.js'; // Import the Category model
import { connectDB } from '../lib/db.js'; // Assuming your DB connection is in db.js

// Sample product data (categories will be randomly assigned from existing categories)
const sampleProducts = [
  {
    name: 'Product 1',
    slug: 'product-1',
    image: '/images/p1.jpg',
    images: ['/images/p1.jpg', '/images/p2.jpg'],
    brand: 'Brand A',
    description: 'Sample description for product 1.',
    price: 100,
    countInStock: 10
  },
  {
    name: 'Product 2',
    slug: 'product-2',
    image: '/images/p3.jpg',
    images: ['/images/p3.jpg', '/images/p4.jpg'],
    brand: 'Brand B',
    description: 'Sample description for product 2.',
    price: 150,
    countInStock: 15
  },
  // Add more sample products as needed
];

const seedProducts = async () => {
  try {
    await connectDB(); // Ensure database is connected

    // Fetch all categories from the database
    const categories = await Category.find();

    if (categories.length === 0) {
      console.error('No categories found in the database!');
      process.exit(1); // Exit if no categories are found
    }

    // Loop through sampleProducts and randomly assign categories
    for (const productData of sampleProducts) {
      // Randomly pick a category ObjectId
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];

      // Create a new product and assign the randomly chosen category's ObjectId
      const product = new Product({
        ...productData,
        category: randomCategory._id, // Assign random category ObjectId
      });

      // Save the product to the database
      await product.save();
      console.log(`Product "${product.name}" has been seeded with category "${randomCategory.name}".`);
    }

    console.log('All products have been seeded!');
    process.exit(); // Exit the process when done
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1); // Exit with error if any occurs
  }
};

seedProducts(); // Run the seed function
