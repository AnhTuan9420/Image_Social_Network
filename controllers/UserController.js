const AppUser = require("../models/AppUserModel");
const Friend = require("../models/FriendModel");
const Posts = require("../models/PostsModel");
const UserModel = require("../models/UserModel");
const Comment = require("../models/commentModel");
const SavePostsModel = require("../models/SavePostsModel");
const LikeModel = require("../models/LikeModel");
var bcrypt = require("bcrypt");

// Get Home
const GetUserHome = async (req, res, next) => {
  const { msg } = req.query;
  try {
    const User = await UserModel.findOne({ account_id: req.session.userId });
    const UserAcc = await AppUser.findOne({ _id: req.session.userId });
    const PostsModel = await Posts.find({})
      .populate("author")
      .sort({ timeCreated: -1 });
    const allFollowing = await Friend.find({ user_session: User._id })
      .populate("user_id")
      .sort({ following: 1 });
    const User1 = await UserModel.find({});
    const followcount = await Friend.countDocuments({ user_session: User._id });
    const followercount = await Friend.countDocuments({ user_id: User._id });
    const postcount = await Posts.countDocuments({ author: User._id });
    const savecount = await SavePostsModel.countDocuments({
      user_id: User._id,
    });

    return res.render("usersViews/HomePage", {
      Posts: PostsModel,
      User: User,
      UserAcc: UserAcc,
      allFollowing: allFollowing,
      err: msg,
      followcount: followcount,
      followercount: followercount,
      postcount: postcount,
      savecount: savecount,
      User1: User1,
    });
  } catch (error) {
    console.log(error);
  }
};

// do Search
const doSearch = async (req, res, next) => {
  const { search } = req.query;
  const keySearch = req.query.search;
  let re = new RegExp(keySearch, "i");
  try {
    const User = await UserModel.findOne({ account_id: req.session.userId });
    const allFollowing = await Friend.find({ user_session: User._id }).populate(
      "user_id"
    );
    const followcount = await Friend.countDocuments({ user_session: User._id });
    const followercount = await Friend.countDocuments({ user_id: User._id });
    const postcount = await Posts.countDocuments({ author: User._id });
    const savecount = await SavePostsModel.countDocuments({
      user_id: User._id,
    });
    const searchPosts = await Posts.find({
      $or: [{ title: re }, { desc: re }],
    }).populate("author");
    return res.render("usersViews/HomePage", {
      Posts: searchPosts,
      search,
      User: User,
      allFollowing: allFollowing,
      followcount: followcount,
      followercount: followercount,
      postcount: postcount,
      savecount: savecount,
    });
  } catch (error) {
    console.log(error);
  }
};

// Add new Post
const addPost = async (req, res, next) => {
  const { title, desc, timeCreated } = req.body;
  const User = await UserModel.findOne({ account_id: req.session.userId });
  try {
    const newPost = new Posts({
      title: title,
      postImage: req.file.filename,
      desc: desc,
      timeCreated: timeCreated,
      author: User._id,
    });
    const result = await newPost.save();
    await User.posts.push(result);
    await User.save();
    const msg = "Add New Post Sucsessfully!";
    return res.redirect(`/user/HomePage?msg=${msg}`);
  } catch (err) {
    console.log(err);
  }
};

const getPost = async (req, res, next) => {
  const { msgs } = req.query;
  try {
    const User = await UserModel.findOne({ account_id: req.session.userId });
    const UserAcc = await AppUser.findOne({ _id: req.session.userId });
    const PostsModel = await Posts.find({ author: User._id }).sort({
      timeCreated: -1, 
    });
    const followcount = await Friend.countDocuments({ user_session: User._id });
    const followercount = await Friend.countDocuments({ user_id: User._id });
    const postcount = await Posts.countDocuments({ author: User._id });
    const savecount = await SavePostsModel.countDocuments({
      user_id: User._id,
    });
    return res.render("usersViews/getPost", {
      Posts: PostsModel,
      UserAcc: UserAcc,
      User: User,
      errs: msgs,
      followcount: followcount,
      followercount: followercount,
      postcount: postcount,
      savecount: savecount,
    });
  } catch (error) {
    console.log(error);
  }
};

// Delete Post
const deletetPost = async (req, res, next) => {
  const { _id } = req.body;  
  try {
    const dele = await Posts.findOneAndRemove({ _id: _id });
    const abc = await SavePostsModel.findOneAndRemove({ posts_id: dele._id });
    const updateUser = await UserModel.findOneAndUpdate(
      {posts: dele._id},
      {$pull: { posts: dele._id}},
      {new:  true}
    );
    const msgs = "Delete Post Success!";
    return res.redirect(`/user/getPost/${_id}?msgs=${msgs}`);
  } catch (error) {
    console.log(error);
  }
};

// Get User Profile
const getUserProfile = async (req, res, next) => {
  const UserAcc = await AppUser.findOne({ _id: req.session.userId });
  const User = await UserModel.findOne({ account_id: req.session.userId });
  const followcount = await Friend.countDocuments({ user_session: User._id });
  const followercount = await Friend.countDocuments({ user_id: User._id });
  const postcount = await Posts.countDocuments({ author: User._id });
  const savecount = await SavePostsModel.countDocuments({ user_id: User._id });
  try {
    return res.render("usersViews/Profile", {
      UserAcc: UserAcc,
      User: User,
      followcount: followcount,
      followercount: followercount,
      postcount: postcount,
      savecount: savecount,
    });
  } catch (error) {
    console.log(error);
  }
};

const getOtherProfile = async (req, res, next) => {
  const _id = req.params.id;
  const demo = {};
  try {
    const User = await UserModel.findOne({ _id: req.params.id });
    const UserAcc = await UserModel.findOne({ account_id: req.session.userId });
    const PostsModel = await Posts.find({ author: User._id });
    const Following = await Friend.findOne({
      user_id: _id,
      user_session: UserAcc._id,
    });
    const followcount = await Friend.countDocuments({ user_session: User._id });
    const followercount = await Friend.countDocuments({ user_id: User._id });
    const postcount = await Posts.countDocuments({ author: User._id });

    if (Following) {
      const FollowingExists = await UserModel.findOne({
        following: Following._id,
      });

      if (FollowingExists) {
        demo["FollowingExists"] = FollowingExists;
      }
    }
    return res.render("usersViews/otherProfile", {
      User: User,
      Posts: PostsModel,
      Following: Following,
      demo,
      followcount: followcount,
      followercount: followercount,
      postcount: postcount,
    });
  } catch (error) {
    console.log(error);
  }
};

// Update Post
const getupdatePost = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const User = await UserModel.findOne({ account_id: req.session.userId });
    const PostsModel = await Posts.findOne({ _id: _id });
    const UserAcc = await AppUser.findOne({ _id: req.session.userId });
    const followcount = await Friend.countDocuments({ user_session: User._id });
    const followercount = await Friend.countDocuments({ user_id: User._id });
    const postcount = await Posts.countDocuments({ author: User._id });
    const savecount = await SavePostsModel.countDocuments({
      user_id: User._id,
    });
    return res.render("usersViews/UpdatePost", {
      UserAcc: UserAcc,
      User: User,
      Posts: PostsModel,
      followcount: followcount,
      followercount: followercount,
      postcount: postcount,
      savecount: savecount,
    });
  } catch (error) {
    console.log(error);
  }
};

const updatePost = async (req, res, next) => {
  const { title, postImage, desc, _id } = req.body;
  const newValue = {};
  if (req.file) {
    const image = req.file.filename;
    newValue.postImage = image;
  }
  if (title) newValue.title = title;
  if (desc) newValue.desc = desc;
  const PostsModel = await Posts.findOne({ _id: _id }).populate("author");
  try {
    await Posts.findOneAndUpdate(
      { _id: _id },
      { $set: newValue },
      { new: true }
    );
    const msg = "Post update successful";
    return res.redirect(`/user/getPost/${_id}?msg=${msg}`);
  } catch (error) {
    console.log(error);
  }
};

// Get Update Inormation
const getupdateInfo = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const UserAcc = await AppUser.findOne({ _id: _id });
    const User = await UserModel.findOne({ account_id: _id });
    const followcount = await Friend.countDocuments({ user_session: User._id });
    const followercount = await Friend.countDocuments({ user_id: User._id });
    const postcount = await Posts.countDocuments({ author: User._id });
    const savecount = await SavePostsModel.countDocuments({
      user_id: User._id,
    });
    return res.render("usersViews/UpdateInfo", {
      UserAcc: UserAcc,
      User: User,
      followcount: followcount,
      followercount: followercount,
      postcount: postcount,
      savecount: savecount,
    });
  } catch (error) {
    console.log(error);
  }
};

// Update Ìnormation
const updateInfo = async (req, res, next) => {
  const { Phone, Address, Age, name, email, gender } = req.body;
  const newValue = {};
  if (req.file) {
    const image = req.file.filename;
    newValue.Avatar = image;
  }
  if (Phone) newValue.Phone = Phone;
  if (Address) newValue.Address = Address;
  if (Age) newValue.Age = Age;
  if (name) newValue.name = name;
  if (email) newValue.email = email;
  if (gender) newValue.gender = gender;

  const UserAcc = await AppUser.findOne({ _id: req.session.userId });
  UserModel.findOneAndUpdate(
    { account_id: UserAcc._id },
    { $set: newValue },
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
        return res.redirect("/user/UpdateInfo");
      } else {
        return res.redirect(`/user/UpdateInfo/${UserAcc._id}`);
      }
    }
  );
};

// Get Post Detail
const getPostDetail = async (req, res, next) => {
  const _id = req.params.id;
  const check = {};
  const checkLike = {};
  try {
    const User = await UserModel.findOne({ account_id: req.session.userId });
    const PostsModel = await Posts.findOne({ _id: _id }).populate("author");
    // Comment display
    const Comments = await Comment.find({ posts: PostsModel }).populate(
      "author"
    );
    const comcount = await Comment.countDocuments({ posts: PostsModel._id });
    const savecount = await SavePostsModel.countDocuments({
      posts_id: PostsModel._id,
    });
    // SavePost display
    const allSavePosts = await SavePostsModel.findOne({
      posts_id: PostsModel._id,
      user_id: User._id,
    });
    if (allSavePosts) {
      const SavePostsExists = await UserModel.findOne({
        saveposts_id: allSavePosts._id,
      });

      if (SavePostsExists) {
        check["Exist"] = SavePostsExists;
      }
    }

    // Like display
    const likecount = await LikeModel.countDocuments({
      posts_id: PostsModel._id,
    });
    const allLikePosts = await LikeModel.findOne({
      posts_id: PostsModel._id,
      user_id: User._id,
    });
    if (allLikePosts) {
      const likePostsExists = await UserModel.findOne({
        like_id: allLikePosts._id,
      });

      if (likePostsExists) {
        checkLike["likePostsExists"] = likePostsExists;
      }
    }

    return res.render("usersViews/Post_Detail", {
      Posts: PostsModel,
      User: User,
      Comment: Comments,
      comcount: comcount,
      SavePosts: allSavePosts,
      LikePosts: allLikePosts,
      likecount: likecount,
      savecount: savecount,
      check,
      checkLike,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get Change Password
const getChangePassword = async (req, res, next) => {
  const _id = req.params.id;
  const { msg } = req.query;
  const { msgs } = req.query;
  try {
    const UserAcc = await AppUser.findOne({ _id: _id });
    const User = await UserModel.findOne({ account_id: _id });
    const followcount = await Friend.countDocuments({ user_session: User._id });
    const followercount = await Friend.countDocuments({ user_id: User._id });
    const postcount = await Posts.countDocuments({ author: User._id });
    const savecount = await SavePostsModel.countDocuments({
      user_id: User._id,
    });
    return res.render("./usersViews/ChangePassword", {
      UserAcc: UserAcc,
      User: User,
      followcount: followcount,
      err: msg,
      errs: msgs,
      followercount: followercount,
      savecount: savecount,
      postcount: postcount,
    });
  } catch (error) {
    console.log(error);
  }
};

const ChangePassword = async (req, res, next) => {
  const { oldpwd, newpwd, pwd2 } = req.body;
  const newValue = {};
  if (newpwd) newValue.password = newpwd;
  const UserAcc = await AppUser.findOne({ _id: req.session.userId });
  AppUser.findOne({ _id: req.session.userId }).exec(async (err, data) => {
    if (err) {
      console.log(err);
    } else {
      bcrypt.compare(oldpwd, data.password, async (err, same) => {
        if (same) {
          if (oldpwd == newpwd) {
            const errorPassword = "Same old password!";
            return res.redirect(
              `/user/ChangePassword/${UserAcc._id}?msg=${errorPassword}`
            );
          } else if (newpwd.length < 4) {
            const errorPassword = "Password must be at least 4 characters !!!";
            return res.redirect(
              `/user/ChangePassword/${UserAcc._id}?msg=${errorPassword}`
            );
          } else if (pwd2 != newpwd) {
            const errorPassword = "Confirm Password Error!";
            return res.redirect(
              `/user/ChangePassword/${UserAcc._id}?msg=${errorPassword}`
            );
          } else {
            AppUser.findOneAndUpdate(
              { _id: data._id },
              { $set: newValue },
              { new: true },
              (err, data) => {
                if (err) {
                  console.log(err);
                  return res.redirect(`user/ChangePassword`);
                } else {
                  const msgs = "Change password successfully!";
                  return res.redirect(
                    `/user/ChangePassword/${UserAcc._id}?msgs=${msgs}`
                  );
                }
              }
            );         
          }
        } else {
          const errorPassword = "Wrong Old Password !";
          return res.redirect(
            `/user/ChangePassword/${UserAcc._id}?msg=${errorPassword}`
          );
        }
      });
    }
  });
};


// Do Comment
const doComment = async (req, res, next) => {
  const { content, com_id } = req.body;
  const User = await UserModel.findOne({ account_id: req.session.userId });
  const PostsModel = await Posts.findOne({ _id: com_id });
  try {
    const com = {
      author: User._id,
      content: content,
      posts: PostsModel._id,
    };
    const newComment = await Comment.create(com);
    const saveCom = await newComment.save();
    await PostsModel.Comment_id.push(saveCom);
    await PostsModel.save();
    res.json(saveCom);
  } catch (error) {
    console.log(error);
  }
};

const deleteComment = async (req, res, next) => {
  const { _id } = req.body;
  try {
    const deleteComment = await Comment.findOneAndRemove({ _id: _id });
    const PostUpdate = await Posts.findOneAndUpdate(
      { Comment_id: deleteComment._id },
      { $pull: { Comment_id: deleteComment._id } },
      { new: true }
    );
    return res.redirect(`/user/Post_Detail/${PostUpdate._id}`);
  } catch (error) {
    console.log(error);
  }
};

// like Post
const likePost = async (req, res, next) => {
  const _id = req.params.id;
  const User = await UserModel.findOne({ account_id: req.session.userId });
  try {
    const likePost = await new LikeModel({
      posts_id: _id,
      user_id: User._id,
    });
    const takeLikePosts = await likePost.save();
    await User.like_id.push(takeLikePosts);
    await User.save();
    return res.redirect(`/user/Post_Detail/${_id}`);
  } catch (err) {
    console.log(err);
  }
};

// unlike Post
const unlikePost = async (req, res, next) => {
  const _id = req.body;
  try {
    const unlikePost = await LikeModel.findOneAndRemove({ _id: _id });
    const abc = await UserModel.findOneAndUpdate(
      { like_id: unlikePost._id },
      { $pull: { like_id: unlikePost._id } },
      { new: true }
    );
    return res.redirect(`/user/Post_Detail/${unlikePost.posts_id}`);
  } catch (error) {
    console.log(error);
  }
};

// Get Saving Posts
const getSavePosts = async (req, res, next) => {
  try {
    const User = await UserModel.findOne({ account_id: req.session.userId });
    const allSavePosts = await SavePostsModel.find({
      user_id: User._id,
    })
      .populate([
        { path: "posts_id", populate: { path: "author" } },
        { path: "user_id" },
      ])
      .sort({ timeCreated: -1 });
    const savecount = await SavePostsModel.countDocuments({
      user_id: User._id,
    });
    return res.render("usersViews/SavePosts", {
      SavePosts: allSavePosts,
      savecount: savecount,
      User: User,
    });
  } catch (error) {
    console.log(error);
  }
};

// Save Posts
const SavePosts = async (req, res, next) => {
  const _id = req.params.id;
  const User = await UserModel.findOne({ account_id: req.session.userId });
  try {
    const newsaveposts = await new SavePostsModel({
      posts_id: _id,
      user_id: User._id,
    });
    const takeSavePosts = await newsaveposts.save();
    await User.saveposts_id.push(takeSavePosts);
    await User.save();
    return res.redirect(`/user/Post_Detail/${_id}`);
  } catch (err) {
    console.log(err);
  }
};

const unSavePosts = async (req, res, next) => {
  const _id = req.body;
  try {
    const Save = await SavePostsModel.findOneAndRemove({ _id: _id });
    const User = await UserModel.findOneAndUpdate(
      { posts_id: Save._id },
      { $pull: { posts_id: Save._id } },
      { new: true }
    );
    return res.redirect(`/user/Post_Detail/${Save.posts_id}`);
  } catch (error) {
    console.log(error);
  }
};

// Follow User
const Following = async (req, res, next) => {
  const _id = req.params.id;
  const User = await UserModel.findOne({ account_id: req.session.userId });
  try {
    const newFollowing = await new Friend({
      user_id: _id,
      user_session: User._id,
    });
    const takeFollowing = await newFollowing.save();
    await User.following.push(takeFollowing);
    await User.save();
    return res.redirect(`/user/OtherProfile/${_id}`);
  } catch (err) {
    console.log(err);
  }
};

const unFollow = async (req, res, next) => {
  const _id = req.body;
  try {
    const Friends = await Friend.findOneAndRemove({ _id: _id });
    const User = await UserModel.findOneAndUpdate(
      { user_id: _id },
      { $pull: { user_id: _id } },
      { new: true }
    );
    return res.redirect(`/user/OtherProfile/${Friends.user_id}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getChangePassword,
  ChangePassword,
  updateInfo,
  getupdateInfo,
  addPost,
  getPost,
  likePost,
  unlikePost,
  deletetPost,
  GetUserHome,
  getUserProfile,
  getOtherProfile,
  getSavePosts,
  SavePosts,
  unSavePosts,
  getPostDetail,
  doComment,
  deleteComment,
  Following,
  unFollow,
  doSearch,
  updatePost,
  getupdatePost,
};
