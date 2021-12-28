var express = require("express");
var router = express.Router();

var { isAdmin } = require("../middleware/RequiresLogin");
var {
    getListUser,
    adminPostDetail,
    listPost,
    adminDeletetPost,
    adminBlockUser,
    adminUnBlockUser,
    
} = require("../controllers/AdminController");

// Get homepage
router.get("/getListUser", isAdmin, getListUser);

router.get("/listPost", isAdmin, listPost);

router.get("/Post_Detail/:id", isAdmin, adminPostDetail);

// router.get('/admin_home', isAdmin, function(req, res, next){
//     res.render("./adminViews/admin_home");
// });

router.delete("/deletePost", isAdmin, adminDeletetPost)
router.put("/blockUser", isAdmin, adminBlockUser)
router.put("/unblockUser", isAdmin, adminUnBlockUser)


module.exports = router;