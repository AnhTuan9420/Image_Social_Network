var mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
  posts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
  },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
