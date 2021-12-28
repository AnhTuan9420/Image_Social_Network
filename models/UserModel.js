var mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    Avatar: {
        type: String,
        default: "profile.png"
    },
    name: {
        type: String,
        default: "User",
        minlength: 4,
        maxlength: 10,
    },
    Phone: {
        type: Number,
    },
    Address: {
        type: String,
    },
    Age: {
        type: Date,
    },
    email: {
        type: String,
        maxlength: 50,
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        default: "Male",
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts",
        }
    ],
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AppUser",
    },
    timeCreated: {
        type: Date,
        default: () => Date.now(),
    },
    saveposts_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SavePosts",
        },
    ],
    like_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Like",
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Friend",
        }
    ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;