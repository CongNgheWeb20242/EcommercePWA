import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { isAuth } from '../lib/utils.js';
import {
  getUser,
  getAllUsers,
  login,
  signup,
  deleteUser,
  updateUser,
  forgetPassword,
  resetPassword,
  getResetPassword,
  googleCallback
} from '../controllers/userController.js';
import { protectedRoute, isAdmin } from '../middlewares/authMiddleware.js';
import passport from 'passport';

const router = express.Router();

// SSO
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', googleCallback);

// GET all users: Chỉ admin mới GET được
router.get('/', protectedRoute, isAdmin, getAllUsers);

// GET user by id
router.get('/:id', protectedRoute, isAdmin, getUser);

// Update profile by user
router.put('/profile', protectedRoute, updateUser);

// Forget password
router.post('/forget-password', forgetPassword);

// Reset password
router.post('/reset-password', resetPassword);

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

router.get('/reset-password/:token', getResetPassword);


export default router;