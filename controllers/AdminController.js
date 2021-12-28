const AppUser = require("../models/AppUserModel");
const Posts = require("../models/PostsModel");
const UserModel = require("../models/UserModel");
const Comment = require("../models/commentModel");
const SavePostsModel = require("../models/SavePostsModel");
const LikeModel = require("../models/LikeModel");

// List User
const getListUser = async (req, res, next) => {
  const { msg } = req.query;
  try {

    const User = await UserModel.find({}).populate("account_id");
    return res.render("adminViews/listUser", {
      User: User,
      err: msg,
    });
  } catch (error) {
    console.log(error);
  }
};

// Admin Post Detail
const adminPostDetail = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const User = await UserModel.findOne({ account_id: req.session.userId });
    const PostsModel = await Posts.findOne({ _id: _id }).populate("author");
    const Comments = await Comment.find({ posts: PostsModel }).populate("author");
    const comcount = await Comment.countDocuments({ posts: PostsModel._id });
    const likecount = await LikeModel.countDocuments({ posts_id: PostsModel._id });
    const savecount = await SavePostsModel.countDocuments({ posts_id: PostsModel._id });
    return res.render("adminViews/admin_PostDetail", {
      Posts: PostsModel,
      User: User,
      Comment: Comments,
      comcount: comcount,
      likecount: likecount,
      savecount: savecount,
    });
  } catch (error) {
    console.log(error);
  }
};

// List Pót
const listPost = async (req, res, next) => {
  const { msg } = req.query;
  try {
    const User = await UserModel.findOne({ account_id: req.session.userId });
    const PostsModel = await Posts.find({}).populate("author").sort({ timeCreated: -1 });
    return res.render("adminViews/listPost", {
      Posts: PostsModel,
      User: User,
      err: msg,
    });
  } catch (error) {
    console.log(error);
  }
};

// Delete Post
const adminDeletetPost = async (req, res, next) => {
  const { _id } = req.body;
  try {
    const deletePost = await Posts.findOneAndRemove({ _id: _id });
    const unSavePosts = await SavePostsModel.findOneAndRemove({ posts_id: deletePost._id });

    const msg = "Delete Post Success!";
    return res.redirect(`/admin/listPost?msg=${msg}`);
  } catch (error) {
    console.log(error);
  }
};

// Block and unBlock User 
const adminBlockUser = async (req, res, next) => {
  const { _id } = req.body;
  try {
    const deleteUser = await UserModel.findOne({ _id: _id });
    const deleteAcc = await AppUser.findOneAndUpdate({ _id: deleteUser.account_id }, { $set: { role: "block" } });

    const msg = "Block User Success!";
    return res.redirect(`/admin/getListUser?msg=${msg}`);
  } catch (error) {
    console.log(error);
  }
};

const adminUnBlockUser = async (req, res, next) => {
  const { _id } = req.body;
  try {
    const deleteUser = await UserModel.findOne({ _id: _id });
    const deleteAcc = await AppUser.findOneAndUpdate({ _id: deleteUser.account_id }, { $set: { role: "user" } });
    const msg = "unBlock User Success!";
    return res.redirect(`/admin/getListUser?msg=${msg}`);
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  getListUser,
  adminPostDetail,
  listPost,
  adminDeletetPost,
  adminBlockUser,
  adminUnBlockUser,
};
