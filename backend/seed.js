import { connectDB } from './lib/db.js';
import Category from './models/categoryModel.js';
import Product from './models/productModel.js';
import Review from './models/reviewModel.js';

const seedData = async () => {
  try {
    await connectDB();

    // Xoá data cũ
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();

    // Tạo Category: Áo và Quần
    const categories = await Category.insertMany([
      { name: 'Áo', description: 'Tất cả các loại áo' },
      { name: 'Quần', description: 'Tất cả các loại quần' },
    ]);

    const aoCategory = categories.find((c) => c.name === 'Áo');
    const quanCategory = categories.find((c) => c.name === 'Quần');

    if (!aoCategory || !quanCategory) {
      throw new Error('Không tìm thấy category Áo hoặc Quần');
    }

    const aoCategoryId = aoCategory._id;
    const quanCategoryId = quanCategory._id;

    // Tạo danh sách 10 sản phẩm (5 áo, 5 quần)
    const products = await Product.insertMany([
      // Áo
      {
        name: 'Áo thun nam cổ tròn Basic',
        slug: 'ao-thun-nam-co-tron-basic',
        image:
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748166711/aW1nMV90am12bGw=/drilldown',
        images: [
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748166711/aW1nczNfb3c4NzNs/drilldown',
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748166711/aW1nczRfemZqbHFh/drilldown',
        ],
        brand: 'Uniqlo',
        description: 'Áo thun nam cổ tròn chất liệu cotton co giãn thoải mái.',
        price: 199000,
        countInStock: 12,
        category: aoCategoryId,
        reviews: [],
      },
      {
        name: 'Áo sơ mi tay dài công sở',
        slug: 'ao-so-mi-tay-dai-cong-so',
        image:
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748167327/MV9mZnFvc2w=/drilldown',
        images: [
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748167327/Ml9jaXB5d20=/drilldown',
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748167327/M19jcmhvMDg=/drilldown',
        ],
        brand: 'Việt Tiến',
        description: 'Áo sơ mi form slimfit thích hợp đi làm, họp hành.',
        price: 349000,
        countInStock: 50,
        category: aoCategoryId,
        reviews: [],
      },
      {
        name: 'Áo hoodie nỉ unisex mùa đông',
        slug: 'ao-hoodie-unisex-mua-dong',
        image:
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748167497/MV92dW12c3Y=/drilldown',
        images: [
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748167523/Ml9nM2F4ZHg=/drilldown',
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748167508/M19udHNzNTY=/drilldown',
        ],
        brand: 'DirtyCoins',
        description: 'Hoodie form rộng cá tính cho cả nam và nữ.',
        price: 450000,
        countInStock: 75,
        category: aoCategoryId,
        reviews: [],
      },

      // Quần
      {
        name: 'Quần jean slim fit nam',
        slug: 'quan-jean-slimfit-nam',
        image:
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748167689/MV92ZjQybXY=/drilldown',
        images: [
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748167688/Ml9ubW02Z3Q=/drilldown',
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748167688/M19qdDNtdng=/drilldown',
        ],
        brand: 'Levis',
        description: 'Quần jean ôm nhẹ vừa phải, màu xanh đậm.',
        price: 499000,
        countInStock: 60,
        category: quanCategoryId,
        reviews: [],
      },
      {
        name: 'Quần short kaki basic',
        slug: 'quan-short-kaki-basic',
        image:
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748167892/MV9nemN4YnI=/drilldown',
        images: [
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748167890/Ml9rcGVmb2c=/drilldown',
          'https://res-console.cloudinary.com/dpfnztxlg/thumbnails/v1/image/upload/v1748167889/M19iZG5mbGM=/drilldown',
        ],
        brand: 'Routine',
        description: 'Quần short dài ngang gối, chất kaki thoáng mát.',
        price: 219000,
        countInStock: 85,
        category: quanCategoryId,
        reviews: [],
      },
    ]);

    // Tạo đánh giá (Review) mẫu cho một vài sản phẩm
    const reviews = await Review.insertMany([
      {
        userName: 'Khách hàng A',
        rating: 5,
        comment: 'Áo thun rất mềm và mát.',
        product: products[0]._id,
      },
      {
        userName: 'Khách hàng B',
        rating: 4,
        comment: 'Sơ mi đúng size, đẹp.',
        product: products[1]._id,
      },
      {
        userName: 'Khách hàng C',
        rating: 5,
        comment: 'Hoodie form rộng mặc thoải mái.',
        product: products[2]._id,
      },
      {
        userName: 'Khách hàng D',
        rating: 3,
        comment: 'Quần jean đẹp nhưng hơi cứng.',
        product: products[5]._id,
      },
    ]);

    // Gán review vào từng sản phẩm tương ứng
    for (const review of reviews) {
      await Product.findByIdAndUpdate(review.product, {
        $push: { reviews: review._id },
      });
    }

    console.log('✅ Seed thành công!');
    process.exit();
  } catch (error) {
    console.error('❌ Seed lỗi:', error);
    process.exit(1);
  }
};

seedData();
