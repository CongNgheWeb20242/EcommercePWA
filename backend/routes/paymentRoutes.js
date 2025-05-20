import express from 'express';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import { createPaymentUrl, vnpayIPN, vnpayReturn } from '../controllers/paymentController.js';

const router = express.Router();

// Tạm thời bỏ qua middleware để test API

router.post('/create_payment_url', protectedRoute, createPaymentUrl);
router.get('/vnpay_ipn', protectedRoute, vnpayIPN);
router.get('/vnpay_return', protectedRoute, vnpayReturn);

export default router;