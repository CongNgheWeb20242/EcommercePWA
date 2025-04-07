import * as productService from '../services/productService.js';
import expressAsyncHandler from 'express-async-handler';

export const getProducts = expressAsyncHandler(async (req, res) => {
    try {
      const products = await productService.getProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

export const createProduct = expressAsyncHandler(async (req, res) => {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).send({ message: 'Product Created', product });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        // MongoDB duplicate error
        const duplicateField = Object.keys(error.keyValue)[0]; // Get the duplicate field
        return res.status(400).json({
          message: `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} must be unique`
        });
      }
      res.status(400).json({ message: error.message || 'Failed to create product' });
    }
});

export const updateProduct = expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    
    try {
      const product = await productService.updateProduct(productId, req.body);
      if (product) {
        res.send({ message: 'Product Updated' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error
        const duplicateField = Object.keys(error.keyValue)[0]; // Get the duplicate field
        return res.status(400).json({
          message: `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} must be unique`
        });
      }
      res.status(400).json({ message: error.message || 'Failed to update product' });
    }
});

export const deleteProduct = expressAsyncHandler(async (req, res) => {
    try {
      const deleted = await productService.deleteProduct(req.params.id);
      if (deleted) {
        res.send({ message: 'Product Deleted' });
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    } catch (error) {
      res.status(500).send({ message: error.message || 'Failed to delete product' });
    }
});

export const addReview = expressAsyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const reviewData = {
      name: req.user.name,
      rating: req.body.rating,
      comment: req.body.comment,
    };
    const product = await productService.addReview(productId, reviewData);
    if (product) {
      res.status(201).send({
        message: 'Review Created',
        review: product.reviews[product.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export const getAdminProducts = expressAsyncHandler(async (req, res) => {
  const { query } = req;
  const page = query.page || 1;
  const pageSize = query.pageSize || 3;
  const result = await productService.getAdminProducts(page, pageSize);
  res.send(result);
});

export const searchProducts = expressAsyncHandler(async (req, res) => {
  const result = await productService.searchProducts(req.query);
  res.send(result);
});

export const getCategories = expressAsyncHandler(async (req, res) => {
  const categories = await productService.getCategories();
  res.send(categories);
});

export const getProductBySlug = expressAsyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export const getProductById = expressAsyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});
