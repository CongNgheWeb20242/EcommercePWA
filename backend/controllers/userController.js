import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';

// SSO
export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    console.log('Google Auth callback:', { err, user, info });
    if (err || !user) {
      return res.status(401).json({ message: 'Google login failed' });
    }
    const token = generateToken(user._id, res);

    // 🔁 Redirect về FE localhost sau khi login
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  })(req, res, next);
};

// GET user by id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select(
      'name email profilePic isAdmin phone address createdAt'
    );
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete user by id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin) {
        res.status(400).json({ message: 'Cannot delete an admin user' });
        return;
      }
      await user.remove();
      res.status(200).json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, password, profilePic } = req.body;
    if (user) {
      user.name = name || user.name;
      // Đang phân vân có nên thay cả email hay không
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
      if (profilePic) {
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
          folder: 'users',
          public_id: `user_${req.user._id} ${name}`, // Tên ảnh
          overwrite: true, // Ghi đè nếu đã tồn tại
        });
        user.profilePic = uploadResponse.secure_url; // URL ảnh từ cloudinary
      }
      // Updated
      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        profilePic: updatedUser.profilePic,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    const token = generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      profilePic: user.profilePic,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Sign-up
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    // hashPass = bcrypt.hash(plainText, salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const token = generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token,
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Link reset password
export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const token = generateToken(user._id, res);
  user.resetToken = token;
  await user.save();

  // Check môi trường hiện tại:
  const isDevP = process.env.NODE_ENV === 'development';
  // Test từ BE nên để cổng 3000
  const FE_BASE_URL = isDevP
    ? 'http://localhost:3000'
    : 'https://yourdomain.com';

  const resetUrl = `${FE_BASE_URL}/api/user/reset-password/${token}`;

  // Tạm thời comment lại phần gửi email
  /*
  try {
    await sendResetPasswordEmail(user.email, resetUrl);
    res.status(200).json({ message: 'Reset password link sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending reset password email' });
  }
  */

  // Tạm thời trả về link reset password
  res.status(200).json({
    message: 'Reset password link generated',
    resetUrl: resetUrl,
  });
};

// Reset password thực sự
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Thiếu token hoặc mật khẩu.' });
    }

    // Xác thực token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }

    // Tìm user theo token reset
    const user = await User.findOne({ resetToken: token });
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy người dùng với token này.' });
    }

    // Hash lại pass
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = null; // clear token sau khi dùng
    await user.save();

    return res.json({ message: 'Đặt lại mật khẩu thành công.' });
  } catch (error) {
    console.error('Lỗi reset password', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Test
// Tạo một route GET để test reset password UI đơn giản
export const getResetPassword = async (req, res) => {
  const { token } = req.params;

  const html = `
    <html>
      <head>
        <title>Reset Password</title>
      </head>
      <body>
        <h2>Đặt lại mật khẩu</h2>
        <form method="POST" action="/api/user/reset-password">
          <input type="hidden" name="token" value="${token}" />
          <label>Mật khẩu mới:</label><br/>
          <input type="password" name="password" required /><br/><br/>
          <button type="submit">Đặt lại</button>
        </form>
      </body>
    </html>
  `;

  res.send(html);
};
