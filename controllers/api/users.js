const Posts          = require("../../models/PostsModel");
const UserModel      = require("../../models/UserModel");


exports.getBlogData = async (req, res, next) => {
    const blogId = req.params.id;

    const User = await UserModel.findOne({ account_id: req.session.userId });
    const PostsModel = await Posts.findOne({ _id: blogId }).populate("author").populate({
        path: 'Comment_id',
        populate: {
            path: 'author',
            populate: {
                path: 'account_id'
            }
        }
    });
    res.json(PostsModel)
};


