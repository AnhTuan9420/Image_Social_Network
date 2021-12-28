var mongoose = require("mongoose");
var FriendSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    
    user_session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    timeCreated: {
        type: Date,
        default: () => Date.now(),
    },
});

const Friend = mongoose.model("Friend", FriendSchema);

module.exports = Friend;
