import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js'
import mongoose from 'mongoose';
import Review from '../models/reviewModel.js';

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
    pages: Math.ceil(countProducts / pageSize)
  };
};

export const getProductById = async (id, user = null) => {
  const visibilityFilter = (!user || !user.isAdmin) ? { isVisible: true } : {};
  return await Product.findById(id)
    .where(visibilityFilter)
    .populate('category')
    .populate('reviews');
};

export const getProductBySlug = async (slug) => {
  return await Product.findOne({ slug });
};

export const createProduct = async (productData) => {
    // Check if the category ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productData.category)) {
      throw new Error('Invalid category ID');
    }
  
    // Check if the category exists in the Category collection
    const categoryExists = await Category.findById(productData.category);
    
    if (!categoryExists) {
      throw new Error('Category does not exist');
    }
  
    const newProduct = new Product({
      ...productData,
      slug: productData.slug || `sample-name-${Date.now()}`,
      isVisible: productData.isVisible ?? true
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

  if (productData.category) {
    const categoryExists = await Category.findById(productData.category);
    if (!categoryExists) {
      throw new Error('Category not found');
    }
  }

  const product = await Product.findById(id);
  if (!product) {
    return null;
  }

  // Only update fields that are provided in productData
  const updateFields = Object.keys(productData).reduce((acc, key) => {
    if (productData[key] !== undefined) {
      acc[key] = productData[key];
    }
    return acc;
  }, {});

  Object.assign(product, updateFields);
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
      product: productId
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
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  const countProducts = await Product.countDocuments();
  return { products, countProducts, page, pages: Math.ceil(countProducts / pageSize) };
};

export const searchProducts = async (queryParams, user = null) => {
  const {
    pageSize = 3,
    page = 1,
    category = '',
    price = '',
    rating = '',
    order = '',
    query = '',
  } = queryParams;

  const queryFilter =
    query && query !== 'all'
      ? { name: { $regex: query, $options: 'i' } }
      : {};
  const categoryFilter = category && category !== 'all' ? { category } : {};
  const ratingFilter =
    rating && rating !== 'all'
      ? { rating: { $gte: Number(rating) } }
      : {};
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};
  const visibilityFilter = (!user || !user.isAdmin) ? { isVisible: true } : {};
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
    ...visibilityFilter,
  });
  return {
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  };
};

export const getCategories = async () => {
  const categories = await Category.find();
  return { categories };
};
