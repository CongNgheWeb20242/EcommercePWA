import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import mongoose from 'mongoose';
import Review from '../models/reviewModel.js';
import { uploadBase64Image } from '../lib/uploadImage.js';

export const getProducts = async (page = 1, pageSize = 10) => {
  const products = await Product.find({ isVisible: true })
    .populate('category') // .populate() để lấy dữ liệu chi tiết từ các bảng liên kết (quan hệ), tương tự "JOIN" trong SQL
    .populate('reviews')
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments({ isVisible: true });

  return {
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  };
};

export const getProductById = async (id, user = null) => {
  const visibilityFilter = !user || !user.isAdmin ? { isVisible: true } : {};
  return await Product.findById(id)
    .where(visibilityFilter)
    .populate('category')
    .populate('reviews');
};

export const getProductBySlug = async (slug) => {
  return await Product.findOne({ slug });
};

export const createProduct = async (productData) => {
  // Xử lý upload images
  const { image, images, ...rest } = productData;

  // Check if the category ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(productData.category)) {
    throw new Error('Invalid category ID');
  }

  // Check if the category exists in the Category collection
  const categoryExists = await Category.findById(productData.category);
  if (!categoryExists) {
    throw new Error('Category does not exist');
  }

  // Upload ảnh chính
  if (!image) throw new Error('Main image is required'); // Nếu FE validate tốt thì không cần dòng này
  const imageUrl = await uploadBase64Image(image);

  // Upload ảnh phụ
  const imageUrls = [];
  if (Array.isArray(images)) {
    for (const base64Img of images) {
      const url = await uploadBase64Image(base64Img);
      imageUrls.push(url);
    }
  }

  const newProduct = new Product({
    ...rest,
    slug: productData.slug || `product-${Date.now()}`,
    image: imageUrl,
    images: imageUrls,
    isVisible: productData.isVisible ?? true, // Dùng để gán giá trị mặc định nếu biến là null hoặc undefined
  });

  const savedProduct = await newProduct.save();
  return await Product.findById(savedProduct._id)
    .populate('category')
    .populate('reviews');
};

export const updateProduct = async (id, productData) => {
  if (!id || !productData) {
    throw new Error('Product ID and update data are required');
  }

  // Validate category nếu có
  if (productData.category) {
    if (!mongoose.Types.ObjectId.isValid(productData.category)) {
      throw new Error('Invalid category ID');
    }
    const categoryExists = await Category.findById(productData.category);
    if (!categoryExists) {
      throw new Error('Category not found');
    }
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }

  // Xử lý ảnh
  const { image, images, ...rest } = productData;

  // Upload ảnh chính nếu có
  if (image) {
    const uploadedImage = await uploadBase64Image(image);
    product.image = uploadedImage;
  }

  // Upload ảnh phụ nếu có
  if (Array.isArray(images)) {
    const uploadedImages = [];
    for (const base64Img of images) {
      const url = await uploadBase64Image(base64Img);
      uploadedImages.push(url);
    }
    product.images = uploadedImages;
  }

  // Cập nhật các trường còn lại
  Object.keys(rest).forEach((key) => {
    if (rest[key] !== undefined) {
      product[key] = rest[key];
    }
  });

  await product.save();

  return await Product.findById(id)
    .populate('category')
    .populate('reviews');
};

export const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (product) {
    await product.remove();
    return true;
  }
  return false;
};

export const addReview = async (productId, reviewData) => {
  const product = await Product.findById(productId);
  if (product) {
    // Check if user has already reviewed this product
    const existingReview = product.reviews.find(
      (reviewId) => reviewId.toString() === reviewData.userId
    );

    if (existingReview) {
      throw new Error('You already submitted a review');
    }

    // Create a new review
    const review = new Review({
      user: reviewData.userId,
      name: reviewData.name,
      rating: Number(reviewData.rating),
      comment: reviewData.comment,
      product: productId,
    });

    // Save the review
    const savedReview = await review.save();

    // Add review ID to product's reviews array
    product.reviews.push(savedReview._id);
    await product.save();

    return await Product.findById(productId)
      .populate('category')
      .populate('reviews');
  }
  return null;
};

export const getAdminProducts = async (page, pageSize) => {
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  const countProducts = await Product.countDocuments();
  return {
    products,
    countProducts,
    page: parseInt(page, 10),
    pages: Math.ceil(countProducts / pageSize),
  };
};

export const searchProducts = async (queryParams, user = null) => {
  let {
    pageSize = 3,
    page = 1,
    category = '',
    price = '',
    ratingFrom = '',
    ratingTo = '',
    order = '',
    query = '',
    brand = '',
    color = '', 
  } = queryParams;
  
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);

  const queryFilter =
    query && query !== 'all' ? { name: { $regex: query, $options: 'i' } } : {};
  const categoryFilter = category && category !== 'all' ? { category } : {};
  let ratingFilter = {};
  if (ratingFrom !== '' && ratingTo !== '') {
    ratingFilter = { averageRating: { $gte: Number(ratingFrom), $lte: Number(ratingTo) } };
  } else if (ratingFrom !== '') {
    ratingFilter = { averageRating: { $gte: Number(ratingFrom) } };
  } else if (ratingTo !== '') {
    ratingFilter = { averageRating: { $lte: Number(ratingTo) } };
  }
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};
  const brandFilter =
    brand && brand !== 'all'
      ? { brand: { $regex: brand, $options: 'i' } }
      : {};
  const colorFilter =
    color && color !== 'all'
      ? { color: { $in: [color] } }
      : {};
  const visibilityFilter = !user || !user.isAdmin ? { isVisible: true } : {};
  const sortOrder =
    order === 'featured'
      ? { featured: -1 }
      : order === 'lowest'
      ? { price: 1 }
      : order === 'highest'
      ? { price: -1 }
      : order === 'toprated'
      ? { rating: -1 }
      : order === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  const products = await Product.find({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
    ...visibilityFilter,
    ...brandFilter,
    ...colorFilter,
  })
    .populate('category')
    .populate('reviews')
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
    ...brandFilter,
    ...colorFilter,
    ...visibilityFilter,
  });
  return {
    products,
    countProducts,
    page: parseInt(page, 10),
    pages: Math.ceil(countProducts / parseInt(pageSize, 10)),
  };
};

export const getCategories = async () => {
  const categories = await Category.find();
  return { categories };
};
