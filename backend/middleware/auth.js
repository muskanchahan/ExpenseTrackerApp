const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'yourSecretKey'); // Use your secret key

    req.userId = decoded.id;

    User.findByPk(req.userId)
      .then(user => {
        if (!user) {
          return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = user;
        next();
      })
      .catch(error => {
        console.error('User lookup failed:', error);
        return res.status(500).json({ success: false, message: 'User lookup failed', error });
      });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

module.exports ={authenticate}; // This should be fine
