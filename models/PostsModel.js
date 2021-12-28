var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var PostsSchema = mongoose.Schema({
    title: {
        type: String,
    },
    postImage: {
        type: String,
    },
    desc: {
        type: String,
        required: true,
    },
    timeCreated: {
        type: Date,
        default: () => Date.now(),
    },
    Comment_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const Posts = mongoose.model("Posts", PostsSchema);

module.exports = Posts;
