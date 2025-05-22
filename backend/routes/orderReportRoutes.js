import express from 'express';
import { protectedRoute, isAdmin } from '../middlewares/authMiddleware.js';
import { reportOrder } from '../controllers/orderReportController.js';

const router = express.Router();

// Only admin can access order report
router.get('/report', protectedRoute, isAdmin, reportOrder);

export default router;