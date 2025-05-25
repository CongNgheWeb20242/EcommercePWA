import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import User from '../models/userModel.js';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
import Review from '../models/reviewModel.js';
import dotenv from "dotenv";
import bcrypt from 'bcryptjs';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

async function seedUsers(n = 1000) {
  const users = [];
    users.push({
    name: 'admin',
    email: 'admin@example.com',
    password: await bcrypt.hash('admin123', 10),
    phone: '0123456789',
    address: 'Admin Address',
    profilePic: '',
    isAdmin: true,
  });

  for (let i = 1; i < n; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(10),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      profilePic: faker.image.avatar(),
      isAdmin: false,
    });
  }
  await User.deleteMany({});
  await User.insertMany(users);
  console.log(`Seeded ${n} users`);
}

async function seedCategories(n = 20) {
  const categories = [];
  for (let i = 0; i < n; i++) {
    categories.push({
      name: faker.commerce.department() + '-' + i,
      description: faker.lorem.sentence(),
    });
  }
  await Category.deleteMany({});
  const inserted = await Category.insertMany(categories);
  console.log(`Seeded ${n} categories`);
  return inserted;
}

async function seedProducts(categories, n = 1000) {
  const products = [];
  for (let i = 0; i < n; i++) {
    const category = faker.helpers.arrayElement(categories);
    const sizes = faker.helpers.arrayElements(['S', 'M', 'L', 'XL', 'XXL'], faker.number.int({ min: 1, max: 4 }));
    const colors = faker.helpers.arrayElements(['Red', 'Blue', 'Black', 'White', 'Green', 'Yellow'], faker.number.int({ min: 1, max: 4 }));
    products.push({
      name: faker.commerce.productName() + '-' + i,
      slug: faker.helpers.slugify(faker.commerce.productName() + '-' + i).toLowerCase(),
      image: faker.image.url(),
      images: [
        faker.image.url(),
        faker.image.url(),
        faker.image.url(),
      ],
      brand: faker.company.name(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price({ min: 10, max: 2000, dec: 2 }),
      countInStock: faker.number.int({ min: 0, max: 100 }),
      isVisible: faker.datatype.boolean(),
      size: sizes,
      color: colors,
      category: category._id,
      reviews: [],
    });
  }
  await Product.deleteMany({});
  const inserted = await Product.insertMany(products);
  console.log(`Seeded ${n} products`);
  return inserted;
}

async function seedReviews(users, products, n = 1000) {
  const reviews = [];
  for (let i = 0; i < n; i++) {
    const user = faker.helpers.arrayElement(users);
    const product = faker.helpers.arrayElement(products);
    reviews.push({
      userId: user._id,
      productId: product._id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(2),
    });
  }
  await Review.deleteMany({});
  const inserted = await Review.insertMany(reviews);
  // Optionally, update products with review references
  for (const review of inserted) {
    await Product.findByIdAndUpdate(review.productId, { $push: { reviews: review._id } });
  }
  console.log(`Seeded ${n} reviews`);
}

async function updateAllAverageRatings(products) {
  for (const product of products) {
    await Product.updateAverageRating(product._id);
  }
  console.log('Updated averageRating for all products');
}

async function main() {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Seed order: User -> Category -> Product -> Review
  await seedUsers(1000);
  const users = await User.find({});
  const categories = await seedCategories(20);
  const products = await seedProducts(categories, 1000);
  await seedReviews(users, products, 1000);
  await updateAllAverageRatings(products);
  await mongoose.disconnect();
  console.log('Seeding completed!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});