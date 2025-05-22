import expressAsyncHandler from 'express-async-handler';
import { getOrderReport } from '../services/orderReportService.js';

export const reportOrder = expressAsyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const report = await getOrderReport({ from, to });
  res.json(report);
});