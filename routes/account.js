var express = require('express');
var router = express.Router();

var { Login, Logout, Register } = require("../controllers/LoginControllers");

const { route } = require(".");


// Get login page
router.get("/login", (req, res, next) => {
  const { msg } = req.query;
  res.render("login", { err: msg, title: "Login to your Account" });
});
router.post("/login", Login);



router.get("/logout", Logout);
// router.get("/signup", Signup)
router.post("/register", Register);

module.exports = router;
