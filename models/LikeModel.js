var mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
    posts_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
    { timestamps: true }
);

const Like = mongoose.model("Like", LikeSchema);

module.exports = Like;
