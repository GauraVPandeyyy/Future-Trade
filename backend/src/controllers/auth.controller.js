const userModel = require("../models/auth.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerController(req, res) {
  const {
    username,
    password,
    applicantName,
    sponserId,
    sponserName,
    address,
    state,
    city,
    gmail,
    bankName,
    branch,
    ifscCode,
    accountNumber,
    panCard,
    adharCard,
  } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "validation_failed",
      message: "username and password are required",
    });
  }

  const userExists = await userModel.findOne({ username });

  // console.log("user...", userExists);
  if (userExists) {
    return res.status(409).json({
      error: "user_exists",
      message: "A user with this username already exists",
    });
  }

  const user = await userModel.create({
    username,
    password: await bcrypt.hash(password, 10),
    applicantName,
    sponserId,
    sponserName,
    address,
    state,
    city,
    gmail,
    bankName,
    branch,
    ifscCode,
    accountNumber,
    panCard,
    adharCard,
    gmail,
    bankName,
    branch,
    ifscCode,
    accountNumber,
    panCard,
    adharCard,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(201).json({
    message: "User Registered Successfully !!!",
  });
}

async function loginController(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "validation_failed",
      message: "username and password are required",
    });
  }

  const user = await userModel.findOne({ username });

  if (!user) {
    return res.status(401).json({
      error: "invalid_credentials",
      message: "username or password is incorrect",
    });
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!user || !checkPassword) {
    return res.status(401).json({
      error: "invalid_credentials",
      message: "username or password is incorrect",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json({
    message: "User Logged in Successfully !!!",
    user,
  });
}

async function userController(req, res) {
  const user = req.user;

  res.status(200).json({
    message: "User Data Fetched Successfully !!!",
    user,
  });
}

async function logOutController(req, res) {
  res.clearCookie("token");

  res.status(200).json({
    message: "User Logged-Out Successfully !!!",
  });
}

module.exports = {
  registerController,
  loginController,
  userController,
  logOutController,
};
