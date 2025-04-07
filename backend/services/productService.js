import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js'
import mongoose from 'mongoose';

export const getProducts = async () => {
  return await Product.find().populate('category');;
};

export const getProductById = async (id) => {
  return await Product.findById(id);
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
      name: productData.name || 'sample name ' + Date.now(),
      slug: productData.slug || 'sample-name-' + Date.now(),
      image: productData.image || '/images/p1.jpg',
      price: productData.price || 0,
      category: productData.category, // Using the category ID directly
      brand: productData.brand || 'sample brand',
      countInStock: productData.countInStock || 0,
      rating: productData.rating || 0,
      numReviews: productData.numReviews || 0,
      description: productData.description || 'sample description',
    });
  
    return await newProduct.save();
};

export const updateProduct = async (id, productData) => {
  if (productData.category) {
    const categoryExists = await Category.findById(productData.category);
    if (!categoryExists) {
      throw new Error('Category not found');
    }
  }

  const product = await Product.findById(id);
  if (product) {
    product.name = productData.name || product.name;
    product.slug = productData.slug || product.slug;
    product.price = productData.price || product.price;
    product.image = productData.image || product.image;
    product.images = productData.images || product.images;
    product.category = productData.category || product.category;
    product.brand = productData.brand || product.brand;
    product.countInStock = productData.countInStock || product.countInStock;
    product.description = productData.description || product.description;
    
    // Save and return the updated product
    return await product.save();
  }
  return null;
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
    if (product.reviews.find((x) => x.name === reviewData.name)) {
      throw new Error('You already submitted a review');
    }

    const review = {
      name: reviewData.name,
      rating: Number(reviewData.rating),
      comment: reviewData.comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;
    return await product.save();
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

export const searchProducts = async (queryParams) => {
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
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });
  return {
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  };
};

export const getCategories = async () => {
  return await Category.find();
};
