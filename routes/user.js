var express = require("express");
var router = express.Router();

var { isUser } = require("../middleware/RequiresLogin");
var {
    getChangePassword,
    ChangePassword,
    updateInfo,
    getupdateInfo,
    getPostDetail,
    addPost,
    getPost,
    deletetPost,
    GetUserHome,
    Following,
    getUserProfile,
    getOtherProfile,
    getSavePosts,
    SavePosts,
    unSavePosts,
    likePost,
    unlikePost,
    doComment,
    deleteComment,
    unFollow,
    doSearch,
    getupdatePost,
    updatePost,
} = require("../controllers/UserController");
var { multerInstance } = require("../middleware/upload");

// Get Homepage
router.get("/HomePage", isUser, GetUserHome);

//Get Saving Posts
router.get("/SavePosts", isUser, getSavePosts);
router.put("/SavePosts/:id", isUser, SavePosts);
router.delete("/unSavePosts", isUser, unSavePosts);

router.put("/likePost/:id", isUser, likePost);
router.delete("/unlikePost", isUser, unlikePost);


// Get user Profile
router.get("/Profile", isUser, getUserProfile);
router.get("/OtherProfile/:id", isUser, getOtherProfile);


// update password   
router.get("/ChangePassword/:id", isUser, getChangePassword);
router.put("/ChangePassword", isUser, ChangePassword);

// Update Information
router.get("/UpdateInfo/:id", isUser, getupdateInfo);
router.post("/UpdateInfo", multerInstance, isUser, updateInfo);

// Update Post
router.get("/UpdatePost/:id", isUser, getupdatePost);
router.post("/UpdatePost", multerInstance, isUser, updatePost);

// Get  Post Detail
router.get("/Post_Detail/:id", isUser, getPostDetail);

// Add new Posts
router.get("/getPost/:id", isUser, getPost);
router.post("/addPost", multerInstance , isUser, addPost);
router.delete("/deletePost", isUser, deletetPost);

//Do Comment
router.post("/doComment", isUser, doComment);
router.delete("/deleteComment", isUser, deleteComment);

router.put("/following/:id", isUser, Following);
router.delete("/unfollowing", isUser, unFollow);

router.get("/doSearch", isUser, doSearch);


module.exports = router;