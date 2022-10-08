require('dotenv').config()
const commentModel = require('../Models/commentModel')
const postModel = require('../Models/postModel')
const notificationModel = require('../Models/notificationModel');
const userModel = require('../Models/userModel');

async function createCommentNotificationHandler (comment, post) {
    // ccId -> comment creator Id
    let ccId = comment.user;
    let userName = (await userModel.findOne({"_id": ccId})).name;
    let notificationObj = {
        type: "comment",
        generatedByUser: ccId,
        targetPostId: post._id,
        receivers: post.user,
        content: `${userName} commented on your post`
    }
    let notification = await notificationModel.create(notificationObj)
    await userModel.findOneAndUpdate({"_id": post.user}, {$push:{"pendingNotifications": notification._id}});
}

async function createComment (req, res) {
    try {
        let commentObj = req.body;
        // let postId = commentObj.postId;
        // delete commentObj.postId;
        let postId = req.body.post;
        let comment = await commentModel.create(commentObj);
        if(comment){
            let post = await postModel.findOneAndUpdate({"_id": postId}, {$push: {"comments": comment._id}});
            if(post){
                post.save();
                // create notification and send to the post owner
                await createCommentNotificationHandler(comment, post);
                return res.json({
                    message: "Comment created successfully",
                    data: comment
                })
            } else {
                await commentModel.findByIdAndDelete(comment._id);
                return res.json({
                    message: "Invalid operation",
                })
            }
        } else {
            return res.json({
                message: "Error while creating comment"
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function getComments (req, res) {
    try {
        let commentsArr = await commentModel.find();
        if(commentsArr.length > 0) {
            return res.json({
                message: "Comments retreived",
                data: commentsArr
            })
        } else {
            return res.json({
                message: "Comments not found",
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function getCommentsArrFromPostId (req, res) {
    try {
        let obj = req.body;
        let post = await postModel.findOne(obj);
        let commentsArr = post.comments;
        if(commentsArr.length > 0) {
            return res.json({
                message: "Comments arr retreived successfully",
                data: commentsArr
            })
        } else {
            return res.json({
                message: "Comments not found"
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function getCommentById (req, res) {
    try {
        let cid = req.params.id;
        let comment = await commentModel.findOne({"_id": cid});
        if(comment) {
            return res.json({
                message: "Comment found successfully",
                data: comment
            })
        } else {
            return res.json({
                message: "Comment not found"
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

module.exports = {
    createComment,
    getComments,
    getCommentsArrFromPostId,
    getCommentById
}