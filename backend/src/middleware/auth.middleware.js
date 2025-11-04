const userModel = require('../models/auth.models');
const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      error: "verification_failed",
      message: "UnAuthorize Access !!!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findOne({ _id: decoded.id });
    req.user = user;

    next();

  } catch (error) {
    return res.status(400).json({
        message : "Inavlid Cookies !! , Please Login again"
    })
  }

}

module.exports = authMiddleware;
