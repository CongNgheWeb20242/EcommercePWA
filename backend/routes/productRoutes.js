import express from 'express';
import { isAuth } from '../lib/utils.js';
import { isAdmin } from '../middlewares/authMiddleware.js';
import * as productController from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/', productController.getProducts);
productRouter.post('/create', isAuth, isAdmin, productController.createProduct);
productRouter.put('/:id', isAuth, isAdmin, productController.updateProduct);
productRouter.delete('/delete/:id', isAuth, isAdmin, productController.deleteProduct);
productRouter.post('/:id/reviews', isAuth, productController.addReview);
productRouter.get('/admin', isAuth, isAdmin, productController.getAdminProducts);
productRouter.get('/search', productController.searchProducts);
productRouter.get('/categories', productController.getCategories);
productRouter.get('/slug/:slug', productController.getProductBySlug);
productRouter.get('/:id', productController.getProductById);

export default productRouter;
