require('dotenv').config()
const postModel = require('../Models/postModel')
const userModel = require('../Models/userModel')
const commentModel = require('../Models/commentModel')
const notificationModel = require('../Models/notificationModel')

async function addNotificationToPendingList (ind, receivers, notificationId) {
    if(ind >= receivers.length){
        return;
    }
    let res = await userModel.findOneAndUpdate({"_id":receivers[ind]}, {$push:{"pendingNotifications": notificationId}});
    if(res) {
        addNotificationToPendingList(ind+1, receivers, notificationId);
    }
}

async function createPostNotificationHandler (user, post) {
    // send notifications to all users
    // 1. make notification
    let usersDB = (await userModel.find({}));
    let receivers = []
    for(let i=0; i<usersDB.length; i++){
        if(!usersDB[i]._id.equals(user._id)){
            receivers.push(usersDB[i]._id);
        }
    }

    let notificationObj = {
        type: "post",
        generatedByUser: user._id,
        targetPostId: post._id,
        receivers,
        content: `${user.name} created a post`
    }
    let notification = await notificationModel.create(notificationObj);
    // 2. send to all users -> add this noti to pending notifications arr of all receivers
    // 3. update pending notifications array of all receivers
    await addNotificationToPendingList(0, receivers, notification._id);
}

async function createPost(req, res) {
    try {
        let textObj = req.body;
        let post = await postModel.create(textObj);
        if (post) {
            let user = await userModel.findOneAndUpdate({ "_id": textObj.user }, { $push: { "posts": post._id } })
            if (user) {
                await user.save();
                await createPostNotificationHandler(user, post);
                return res.json({
                    message: "Post created successfully",
                    data: post
                })
            } else {
                let deletePost = await postModel.findByIdAndDelete(post._id);
                return res.json({
                    message: "Invalid operation"
                })
            }
        } else {
            return res.json({
                message: "Error while creating post"
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function getPosts(req, res) {
    try {
        let postsArr = await postModel.find();
        if (postsArr.length > 0) {
            return res.json({
                message: "Posts retreived",
                data: postsArr
            })
        } else {
            return res.json({
                message: "Posts not found",
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function getPostsWithUserId(req, res) {
    try {
        let uid = req.params.id;
        let postsArr = await postModel.find({"user": uid});
        if (postsArr) {
            return res.json({
                message: "Posts arr retreived",
                data: postsArr
            })
        } else {
            return res.json({
                message: "Posts not found"
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function likePostNotificationHandler (uid, postId) {
    let username = (await userModel.findOne({"_id": uid})).name;
    let postOwner = (await postModel.findOne({"_id": postId})).user;
    let receivers = [postOwner]
    let notificationObj = {
        type: "like",
        generatedByUser: uid,
        targetPostId: postId,
        receivers,
        content: `${username} liked your post`
    }
    // 1. make notification
    let notification = await notificationModel.create(notificationObj);
    // 2. push this notification to the postOwner pending notifications
    await userModel.findOneAndUpdate({"_id": postOwner}, {$push:{"pendingNotifications": notification._id}});
}

async function likePost (req, res) {
    try {
        let {uid, postId} = req.body;
        let likedPosts = (await userModel.findOne({"_id": uid})).likedPosts;
        let likedByArr = (await postModel.findOne({"_id": postId})).likedBy;
        let updated = 0;
        if(likedPosts) {
            let ind = likedPosts.indexOf(postId);
            if(ind==-1){
                likedPosts.push(postId);
                updated = 1;
                likedByArr.push(uid);
            } else {
                likedPosts.splice(ind, 1);
                updated = -1;
                let userInd = likedByArr.indexOf(uid);
                likedByArr.splice(userInd, 1);
            }
            await userModel.findOneAndUpdate({"_id": uid}, {$set:{"likedPosts": likedPosts}});
            let postLikes = (await postModel.findOne({"_id": postId})).likes;
            await postModel.findOneAndUpdate({"_id": postId}, {$set:{"likes": likedByArr.length, "likedBy":likedByArr}});
            if(updated == 1){
                // liking for the first time
                await likePostNotificationHandler(uid, postId);
            }
            return res.json({
                message: "post likes updated successfully",
                updated,
            })
        } else {
            return res.json({
                message: "likedPosts array not found"
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function deleteComment (commentsArr, ind) {
    if(ind >= commentsArr.length) {
        return;
    }
    let res = commentModel.findOneAndDelete({"_id": commentsArr[ind]});
    res.then((deletedComment) => {
        console.log("inside recursion deletedComment", deletedComment);
        deleteComment(commentsArr, ind+1)
    });
}

async function removePostFromLikedPosts (likedByUsers, ind, postId) {
    console.log("inside recursion remove from liked posts ind", ind, likedByUsers.length);
    if(ind >= likedByUsers.length) {
        return;
    }
    let userId = likedByUsers[ind];
    console.log("inside recursion userId", userId)
    let resp = userModel.findOne({"_id": userId})
    resp.then((user) => {
        console.log("inside recursion user", user)
        let likedPostsArr = user.likedPosts
        console.log("inside recursion likedPostsArr", likedPostsArr)
        let index = likedPostsArr.indexOf(postId);
        console.log("inside recursion index", index)
        likedPostsArr.splice(index, 1);
        let resp2 = userModel.findOneAndUpdate({"_id":userId}, {$set:{"likedPosts": likedPostsArr}});
        resp2.then((user) => {
            console.log("inside recursion resp2", user)
            removePostFromLikedPosts(likedByUsers, ind+1, postId);
        })
    })
}

async function deletePost (req, res) {
    try {
        let postId = req.params.id;
        console.log("postId", postId);
        let userId = (await postModel.findOne({"_id": postId})).user;
        console.log("userId", userId);
        let post = (await postModel.findOne({"_id": postId}));
        console.log("post", post);
        let commentsArr = post.comments;
        console.log("commentsArr", commentsArr);
        let likedByUsers = post.likedBy;
        console.log("likedByUsers", likedByUsers);

        // deleting post
        let deletedPost = await postModel.findOneAndDelete({"_id": postId});
        console.log("deletedPost", deletedPost);

        // delete from posts array of user
        let userPostsArr = (await userModel.findOne({"_id": userId})).posts;
        console.log("userPostsArr", userPostsArr)
        let ind = userPostsArr.indexOf(postId);
        console.log("ind", ind)
        userPostsArr.splice(ind, 1);
        let updatedUser = (await userModel.findOneAndUpdate({"_id": userId}, {$set:{"posts": userPostsArr}}));
        console.log("updatedUser", updatedUser)

        // deleting comments of the post
        await deleteComment(commentsArr, 0);

        // delete from users likedPosts array
        await removePostFromLikedPosts(likedByUsers, 0, postId)
        return res.json({
            message: "Post removed successfully",
            data: post
        })
    } catch (err) {
        console.log("error occured")
        return res.json({
            message: err.message
        })
    }
}

async function getSinglePost (req, res) {
    try {
        let postId = req.params.id;
        let post = await postModel.findOne({"_id": postId});
        if(post){
            return res.json({
                message: "Post found",
                data: post
            })
        } else {
            return res.json({
                message: "No post found",
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

module.exports = {
    createPost,
    getPosts,
    getPostsWithUserId,
    likePost,
    deletePost,
    getSinglePost,
}