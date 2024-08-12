const jwt = require('jsonwebtoken');
const {User} = require('./db');
const { config } = require('dotenv');
config();
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });
    
    if (!user) {
      throw new Error();
    }
    
    req.user = user._id;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Please authenticate" });
  }
};

module.exports = auth;