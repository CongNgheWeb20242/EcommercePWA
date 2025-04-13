import express from 'express';
import { createPaymentUrl, vnpayIPN, vnpayReturn } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create_payment_url', createPaymentUrl);
router.get('/vnpay_ipn', vnpayIPN);
router.get('/vnpay_return', vnpayReturn);

export default router;