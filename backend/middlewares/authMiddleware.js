import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const isAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    // Không phải admin
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  next();
}

export const protectedRoute = async (req, res, next) => {
  try {
    // Get token from request
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - No Token Provided' });
    }

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
