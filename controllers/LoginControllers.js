var AppUser = require("../models/AppUserModel");
var bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");

const Signup = async (req, res, next) => {
  const user = AppUser({
    username: "admin",
    password: "admin",
    role: "admin",
  });
  await user.save();
  console.log(user);
  return res.send(user);
};

const Register = async (req, res, next) => {
  const { usr, pwd, pwd2 } = req.body;
  await AppUser.findOne({ username: usr }).exec(async (err, user) => {
    if (err) {
      return console.log(err);
    } else if (user) {
      const errorUsername = "Username has already existed !!!";
      return res.redirect(`/register?msg=${errorUsername}`);
    } else if (usr.length < 4) {
      const errorUsername = "Username must be at least 4 characters !!!";
      return res.redirect(`/register?msg=${errorUsername}`);
    }else if (pwd.length < 4) {
      const errorPassword = "Password must be at least 4 characters !!!";
      return res.redirect(`/register?msg=${errorPassword}`);
    } else if (pwd2 != pwd) {
      const errorPassword = "Confirm Password Error!";
      return res.redirect(`/register?msg=${errorPassword}`);
    } else {
      const newUserAcc = new AppUser({
        username: usr,
        password: pwd,
        role: "user",
      });
      await newUserAcc.save();
      
      const UserAcc = await AppUser.findOne({ username: usr });
      const newUser = new UserModel({
        account_id: UserAcc._id,
      });
      await newUser.save();
      return res.redirect("/");
      // res.send("Successfully !");
    }
  });
};

const Login = (req, res, next) => {
  console.log(req.body);
  const { usr, pwd } = req.body;
  console.log(usr);
  AppUser.findOne({ username: usr }).exec((err, user) => {
    if (err) {
      console.log(err);
      return res.redirect("/account/login");
    } else if (!user) {
      // res.status(401);
      const msg = "The username does not exist or has been locked !!! You can click Sign up to register a new account. ";
      return res.redirect(`/account/login?msg=${msg}`);
    } else {
      bcrypt.compare(pwd, user.password, (err, same) => {
        if (same) {
          req.session.userId = user._id;
          req.session.isAdmin = user.role === "admin" ? true : false;
          req.session.isUser = user.role === "user" ? true : false;
          req.session.isUserBlock = user.role === "block" ? true : false;

          if (user.role === "admin") {
            return res.redirect(`/admin/getListUser`);
          } else if (user.role === "user") {
            return res.redirect(`/user/HomePage`);
          } else if (user.role === "block") {
            const msg = "Your account has been locked !!!";
            return res.redirect(`/account/login?msg=${msg}`);
          }
        } else {
          const msg = "Username or Password is incorrect!";
          return res.redirect(`/account/login?msg=${msg}`);
        }
      });
    }
  });
};

const Logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
};

module.exports = { Login, Logout, Register, Signup };
