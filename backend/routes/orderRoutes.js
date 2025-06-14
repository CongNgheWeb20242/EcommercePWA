import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { isAuth } from '../lib/utils.js';
import { isAdmin } from '../middlewares/authMiddleware.js';
import { v4 as uuidv4 } from 'uuid';
const orderRouter = express.Router();

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name email');
    res.send(orders);
  })
);

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      order_id: uuidv4(),
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
  })
);

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: 'Order Delivered' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

// orderRouter.put(
//   '/:id/pay',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id).populate(
//       'user',
//       'email name'
//     );
//     if (order) {
//       order.isPaid = true;
//       order.paidAt = Date.now();
//       order.paymentResult = {
//         id: req.body.id,
//         status: req.body.status,
//         update_time: req.body.update_time,
//         email_address: req.body.email_address,
//       };

//       const updatedOrder = await order.save();
//       mailgun()
//         .messages()
//         .send(
//           {
//             from: 'Amazona <amazona@mg.yourdomain.com>',
//             to: `${order.user.name} <${order.user.email}>`,
//             subject: `New order ${order._id}`,
//             html: payOrderEmailTemplate(order),
//           },
//           (error, body) => {
//             if (error) {
//               console.log(error);
//             } else {
//               console.log(body);
//             }
//           }
//         );

//       res.send({ message: 'Order Paid', order: updatedOrder });
//     } else {
//       res.status(404).send({ message: 'Order Not Found' });
//     }
//   })
// );

// orderRouter.delete(
//   '/:id',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id);
//     if (order) {
//       await order.remove();
//       res.send({ message: 'Order Deleted' });
//     } else {
//       res.status(404).send({ message: 'Order Not Found' });
//     }
//   })
// );

orderRouter.get(
  '/search',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { email, phone, name } = req.query;

    // Build user filter
    let userFilter = {};
    if (email) userFilter.email = email;
    if (phone) userFilter.phone = phone;
    if (name) userFilter.name = { $regex: name, $options: 'i' };

    // Find matching users
    let userIds = [];
    if (Object.keys(userFilter).length > 0) {
      const users = await User.find(userFilter).select('_id');
      userIds = users.map(u => u._id);
    }

    // Find orders by user
    const orderFilter = userIds.length > 0 ? { user: { $in: userIds } } : {};
    const orders = await Order.find(orderFilter)
      .populate('user', 'name email phone')
      .populate('orderItems.product');

    res.json(orders);
  })
);

orderRouter.put(
  '/:id/status',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { status } = req.body;
    // Kiểm tra hợp lệ
    if (![0, 1, 2].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();

    if (order.user && order.user.email) {
      await sendOrderStatusEmail(order.user.email, order.order_id, status);
    }

    res.json({ message: 'Order status updated', order });
  })
);

export default orderRouter;
