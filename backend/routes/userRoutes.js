import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { isAuth } from '../lib/utils.js';
import { getUser, getAllUsers, login, signup, deleteUser, updateUser, forgetPassword, resetPassword, getResetPassword } from '../controllers/userController.js';
import { protectedRoute, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET all users: Chỉ admin mới GET được
router.get('/', protectedRoute, isAdmin, getAllUsers);

// GET user by id
router.get('/:id', protectedRoute, isAdmin, getUser);

// Update profile by user
router.put('/profile', protectedRoute, updateUser);

// Forget password
router.post("/forget-password", forgetPassword);

// Reset password
router.post("/reset-password", resetPassword);

// Forgot password
// router.post(
//   '/forget-password',
//   expressAsyncHandler(async (req, res) => {
//     const user = await User.findOne({ email: req.body.email });

//     if (user) {
//       const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: '3h',
//       });
//       user.resetToken = token;
//       await user.save();

//       //reset link
//       console.log(`${baseUrl()}/reset-password/${token}`);

//       mailgun()
//         .messages()
//         .send(
//           {
//             from: 'Amazona <me@mg.yourdomain.com>',
//             to: `${user.name} <${user.email}>`,
//             subject: `Reset Password`,
//             html: ` 
//              <p>Please Click the following link to reset your password:</p> 
//              <a href="${baseUrl()}/reset-password/${token}"}>Reset Password</a>
//              `,
//           },
//           (error, body) => {
//             console.log(error);
//             console.log(body);
//           }
//         );
//       res.send({ message: 'We sent reset password link to your email.' });
//     } else {
//       res.status(404).send({ message: 'User not found' });
//     }
//   })
// );

// Reset password
// router.post(
//   '/reset-password',
//   expressAsyncHandler(async (req, res) => {
//     jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
//       if (err) {
//         res.status(401).send({ message: 'Invalid Token' });
//       } else {
//         const user = await User.findOne({ resetToken: req.body.token });
//         if (user) {
//           if (req.body.password) {
//             user.password = bcrypt.hashSync(req.body.password, 8);
//             await user.save();
//             res.send({
//               message: 'Password reseted successfully',
//             });
//           }
//         } else {
//           res.status(404).send({ message: 'User not found' });
//         }
//       }
//     });
//   })
// );

// Update user by admin?
router.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

// Delete user by id
router.delete('/:id', protectedRoute, isAdmin, deleteUser);

// Login
router.post('/login', login);

// Sign up
router.post('/signup', signup);

router.get("/reset-password/:token", getResetPassword)

export default router;
