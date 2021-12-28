var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

const AppUserSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 4,
        maxlength: 100,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 4,
        maxlength: 255,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user", "block"],
        default: "user",
    },
    timeCreated: {
        type: Date,
        default: () => Date.now(),
    },
});

AppUserSchema.path("password").set((inputString) => {
    return (inputString = bcrypt.hashSync(
        inputString,
        bcrypt.genSaltSync(10),
        null
    ));
});

const AppUser = mongoose.model("AppUser", AppUserSchema);

module.exports = AppUser;
