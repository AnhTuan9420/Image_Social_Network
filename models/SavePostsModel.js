var mongoose = require("mongoose");

const SavePostsSchema = new mongoose.Schema({
  posts_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
});

const SavePosts = mongoose.model("SavePosts", SavePostsSchema);

module.exports = SavePosts;
