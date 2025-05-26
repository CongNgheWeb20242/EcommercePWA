import express from 'express';
import { protectedRoute, isAdmin } from '../middlewares/authMiddleware.js';
import * as productController from '../controllers/productController.js';

const productRouter = express.Router();

// GET: Get all products
productRouter.get('/', productController.getProducts);

// POST: Create a new product
productRouter.post('/create', protectedRoute, isAdmin, productController.createProduct);

productRouter.put('/:id/update', protectedRoute, isAdmin, productController.updateProduct);
productRouter.delete('/delete/:id', protectedRoute, isAdmin, productController.deleteProduct);
productRouter.post('/:id/reviews', protectedRoute, productController.addReview);
productRouter.get('/admin', protectedRoute, isAdmin, productController.getAdminProducts);
productRouter.get('/search', productController.searchProducts);
productRouter.get('/categories', productController.getCategories);
productRouter.get('/slug/:slug', productController.getProductBySlug);
productRouter.get('/:id', productController.getProductById);

export default productRouter;
