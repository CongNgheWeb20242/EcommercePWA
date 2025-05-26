import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Make sure this path is correct

export const baseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://ecommercepwa-be.onrender.com'
  } else {
    return 'http://localhost:3000';
  }
}

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  return token;
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  console.log('authorization', authorization);
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      console.log('decode', decode);
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        const user = await User.findById(decode.userId);
        if (!user) {
          return res.status(401).send({ message: 'User Not Found' });
        }
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

// export const mailgun = () =>
//   mg({
//     apiKey: process.env.MAILGUN_API_KEY,
//     domain: process.env.MAILGUN_DOMIAN,
//   });

// export const payOrderEmailTemplate = (order) => {
//   return `<h1>Thanks for shopping with us</h1>
//   <p>
//   Hi ${order.user.name},</p>
//   <p>We have finished processing your order.</p>
//   <h2>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h2>
//   <table>
//   <thead>
//   <tr>
//   <td><strong>Product</strong></td>
//   <td><strong>Quantity</strong></td>
//   <td><strong align="right">Price</strong></td>
//   </thead>
//   <tbody>
//   ${order.orderItems
//     .map(
//       (item) => `
//     <tr>
//     <td>${item.name}</td>
//     <td align="center">${item.quantity}</td>
//     <td align="right"> $${item.price.toFixed(2)}</td>
//     </tr>
//   `
//     )
//     .join('\n')}
//   </tbody>
//   <tfoot>
//   <tr>
//   <td colspan="2">Items Price:</td>
//   <td align="right"> $${order.itemsPrice.toFixed(2)}</td>
//   </tr>
//   <tr>
//   <td colspan="2">Shipping Price:</td>
//   <td align="right"> $${order.shippingPrice.toFixed(2)}</td>
//   </tr>
//   <tr>
//   <td colspan="2"><strong>Total Price:</strong></td>
//   <td align="right"><strong> $${order.totalPrice.toFixed(2)}</strong></td>
//   </tr>
//   <tr>
//   <td colspan="2">Payment Method:</td>
//   <td align="right">${order.paymentMethod}</td>
//   </tr>
//   </table>

//   <h2>Shipping address</h2>
//   <p>
//   ${order.shippingAddress.fullName},<br/>
//   ${order.shippingAddress.address},<br/>
//   ${order.shippingAddress.city},<br/>
//   ${order.shippingAddress.country},<br/>
//   ${order.shippingAddress.postalCode}<br/>
//   </p>
//   <hr/>
//   <p>
//   Thanks for shopping with us.
//   </p>
//   `;
// };
