const express = require("express");
const { postController } = require("../controllers/post.controller");
const authMiddleware = require("../middleware/auth.middleware");
const postModel = require('../models/post.models');
const multer = require('multer');


const router = express.Router();
const upload = multer({storage: multer.memoryStorage()})

router.post("/", authMiddleware, upload.single('image'), postController);

module.exports = router;
