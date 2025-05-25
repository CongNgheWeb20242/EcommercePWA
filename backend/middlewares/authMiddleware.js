import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const isAdmin = async (req, res, next) => {
  console.log(req.user)
  if (!req.user.isAdmin) {
    // Không phải admin
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  next();
}

// Cho phép admin hoặc chính user đó truy cập
export const isAdminOrSelf = (req, res, next) => {
  if (req.user.isAdmin || req.user._id.toString() === req.params.id) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden" });
};

// protectedRoute là middleware để bảo vệ các route cần xác thực người dùng
export const protectedRoute = async (req, res, next) => {
  try {
    // Get token from request
    const authHeader = req.headers.authorization;;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - No Token Provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer token

    // jwt.verify() -> return: payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(400).json({ message: 'User not Found' });
    }
    
    // user ở đây là all thông tin trừ password
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in protectedRoute middleware:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
