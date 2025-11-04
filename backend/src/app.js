const express = require('express');
const authRouters = require('./routes/auth.router');
const postsRouters = require('./routes/posts.router');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true // This allows cookies to be sent with requests
}));

app.use(express.json());

app.use(cookieParser());
app.use('/api/auth', authRouters);


module.exports = app;