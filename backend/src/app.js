const express = require('express');
const authRouters = require('./routes/auth.router');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Enable CORS
app.use(cors({
  origin: ["https://future-trade-eight.vercel.app", "http://localhost:3000"], // Replace with your frontend URL
  credentials: true // This allows cookies to be sent with requests
}));

app.use(express.json());

app.use(cookieParser());
app.use('/api/auth', authRouters);


module.exports = app;