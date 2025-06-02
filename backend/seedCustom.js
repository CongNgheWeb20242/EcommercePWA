import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';
import Category from './models/categoryModel.js';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

const sampleProducts = [
  {
    name: 'Áo thun basic nam',
    slug: 'ao-thun-basic-nam',
    brand: 'Nike',
    price: 129000,
    size: ['M', 'L'],
    color: ['black', 'white', "yellow"],
    sexual: 'male',
    categoryName: 'Áo thun',
    image: "https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748844628/cDFfcmdpcnhr/drilldown",
    images: ["https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748844762/cDJfZXZsemtr/drilldown"]
  },
  {
    name: 'Áo sơ mi trắng nữ công sở',
    slug: 'ao-so-mi-trang-nu',
    brand: 'Adidas',
    price: 349000,
    size: ['S', 'M', 'L'],
    color: ['white'],
    sexual: 'female',
    categoryName: 'Áo sơ mi',
    image: "https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748844879/cDFfcWZiNmRm/drilldown",
  },
  {
    name: 'Áo dài truyền thống đỏ',
    slug: 'ao-dai-truyen-thong-do',
    brand: '  ',
    price: 890000,
    size: ['S', 'M', 'L'],
    color: ['purple'],
    sexual: 'female',
    categoryName: 'Áo dài',
    image: "https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748845077/ZDJfd24wMnFw/drilldown",
    images: ["https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748845079/ZDFfdW51eWdy/drilldown", "https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748845079/ZDNfdHppd212/drilldown"],
  },
  {
    name: 'Áo khoác gió chống nước',
    slug: 'ao-khoac-gio-chong-nuoc',
    brand: 'Puma',
    price: 459000,
    size: ['M', 'L', 'XL'],
    color: ['blue', 'black'],
    sexual: 'unisex',
    categoryName: 'Áo khoác',
    image: "https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748845225/ZTJfcDM4emRr/drilldown",
    images: ["https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748845226/ZTFfc2hkeHl4/drilldown"]
  },
  {
    name: 'Hoodie nỉ trơn Hàn Quốc',
    slug: 'hoodie-ni-han-quoc',
    brand: 'Nike',
    price: 319000,
    size: ['L', 'XL'],
    color: ['grey', 'black'],
    sexual: 'unisex',
    categoryName: 'Áo hoodie',
    image: "https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748845360/ZjJfZHd1bGdk/drilldown",
    images: ["https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748845363/ZjNfcmJ6bXdk/drilldown", "https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748845361/ZjFfdXRsbTN5/drilldown"]
  },
  // {
  //   name: 'Áo tanktop gym nam',
  //   slug: 'tanktop-gym-nam',
  //   brand: 'Adidas',
  //   price: 159000,
  //   size: ['M', 'L'],
  //   color: ['black'],
  //   sexual: 'male',
  //   categoryName: 'Áo tanktop',
  // },
  // {
  //   name: 'Quần jean nữ ống suông',
  //   slug: 'quan-jean-nu-ong-suong',
  //   brand: 'Converse',
  //   price: 429000,
  //   size: ['S', 'M'],
  //   color: ['blue'],
  //   sexual: 'female',
  //   categoryName: 'Quần jean',
  // },
  // {
  //   name: 'Quần short kaki nam',
  //   slug: 'quan-short-kaki-nam',
  //   brand: 'Puma',
  //   price: 199000,
  //   size: ['M', 'L', 'XL'],
  //   color: ['yellow', 'grey'],
  //   sexual: 'male',
  //   categoryName: 'Quần short',
  // },
  // {
  //   name: 'Váy maxi dự tiệc',
  //   slug: 'vay-maxi-du-tiec',
  //   brand: 'Adidas',
  //   price: 599000,
  //   size: ['S', 'M', 'L'],
  //   color: ['purple'],
  //   sexual: 'female',
  //   categoryName: 'Váy/Đầm',
  // },
  // {
  //   name: 'Bộ đồ ngủ cotton nữ',
  //   slug: 'bo-do-ngu-cotton-nu',
  //   brand: 'Nike',
  //   price: 249000,
  //   size: ['M', 'L'],
  //   color: ['white', 'blue'],
  //   sexual: 'female',
  //   categoryName: 'Bộ đồ ngủ',
  // },
];

async function seedProducts() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const categories = await Category.find({});
  const categoryMap = {};
  categories.forEach(cat => categoryMap[cat.name] = cat._id);

  const products = sampleProducts.map(p => ({
    ...p,
    image: p.image || '',
    images: p || [],
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
