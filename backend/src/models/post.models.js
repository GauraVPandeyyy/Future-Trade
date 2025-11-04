const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    image : String,
    caption : String,
    postBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Post = mongoose.model('PostData', postSchema);

module.exports = Post;