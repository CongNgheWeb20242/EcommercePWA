import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';
import Category from './models/categoryModel.js';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

const sampleProducts = [
  {
    name: 'Áo tanktop gym nam',
    slug: 'tanktop-gym-nam',
    brand: 'Adidas',
    price: 159000,
    size: ['M', 'L'],
    color: ['black'],
    sexual: 'male',
    categoryName: 'Áo tanktop',
    image: "https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748845972/ZzFfeHF5aHE1/drilldown",
    images: ["https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748845959/ZzJfYmpzaDlm/drilldown"],
  },
  {
    name: 'Quần jean nữ ống suông',
    slug: 'quan-jean-nu-ong-suong',
    brand: 'Converse',
    price: 429000,
    size: ['S', 'M'],
    color: ['blue'],
    sexual: 'female',
    categoryName: 'Quần jean',
    image: "https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748846119/ejJfeHZqbWZx/drilldown",
    images: ["https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748846119/ejFfZ25oemhp/drilldown"]
  },
  {
    name: 'Quần short kaki nam',
    slug: 'quan-short-kaki-nam',
    brand: 'Puma',
    price: 199000,
    size: ['M', 'L', 'XL'],
    color: ['yellow', 'grey'],
    sexual: 'male',
    categoryName: 'Quần short',
    image: 'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748846313/bTFfZXB1Nmx3/drilldown',
    images: ['https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748846314/bTNfem90YmZo/drilldown', 'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748846316/bTJfa2FmZjBz/drilldown']
  },
  {
    name: 'Váy maxi dự tiệc',
    slug: 'vay-maxi-du-tiec',
    brand: 'Adidas',
    price: 599000,
    size: ['S', 'M', 'L'],
    color: ['purple'],
    sexual: 'female',
    categoryName: 'Váy/Đầm',
    image: 'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748846627/djFfZnczamx5/drilldown',
    images: ["https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748846628/djJfd2NqdWIx/drilldown"]
  },
  {
    name: 'Bộ đồ ngủ cotton nữ',
    slug: 'bo-do-ngu-cotton-nu',
    brand: 'Nike',
    price: 249000,
    size: ['M', 'L'],
    color: ['white', 'blue'],
    sexual: 'female',
    categoryName: 'Bộ đồ ngủ',
    image: "https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748846702/ajFfZGsxaXQ0/drilldown",
  },
];

async function seedProducts() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const categories = await Category.find({});
  const categoryMap = {};
  categories.forEach(cat => categoryMap[cat.name] = cat._id);

  const products = sampleProducts.map(p => ({
    ...p,
    image: p.image || '',
    images: p.images || [],
    description: `Sản phẩm: ${p.name}, chất lượng cao, thương hiệu ${p.brand}.`,
    countInStock: Math.floor(Math.random() * 100),
    isVisible: true,
    category: categoryMap[p.categoryName],
    reviews: [],
  }));

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`✅ Seeded ${products.length} sản phẩm`);
  await mongoose.disconnect();
}

seedProducts().catch(err => {
  console.error(err);
  process.exit(1);
});
