import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Make sure this path is correct

export const baseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://ecommercepwa-be.onrender.com'
  } else {
    return 'http://localhost:3000';
  }
}

// ✅ Thêm thông tin user cần dùng
export const generateToken = (user, res) => {
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.username,
      email: user.email,
      profilePic: user.profilePic,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );

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