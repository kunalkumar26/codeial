require('dotenv').config()
const express = require("express");

const userRouter = express.Router();

const {
    getAllUsers,
    signup,
    login,
    protectRoute,
    getUser,
    updateUser,
    deleteUser,
    getUserLikedPostsArr,
    updateProfile,
    getUserById,
    handleFollowing,
    getUserNotifications
} = require("../Controllers/userController");

const {
    createPost,
    getPosts,
    getPostsWithUserId,
    likePost,
    deletePost,
    getSinglePost
} = require('../Controllers/postController')

const {
    createComment,
    getCommentsArrFromPostId,
    getCommentById
} = require('../Controllers/commentController')

const {
    getNotificationById,
    notificationResolved,
    deleteNotificationById
} = require('../Controllers/notificationController')



userRouter
.route('/all')
.get(getAllUsers)

userRouter
.route("/signup")
.post(signup)

userRouter
.route("/login")
.post(login)

userRouter
.route('/post')
.post(createPost)
.get(getPosts)

userRouter
.route('/post/:id')
.get(getSinglePost)
.delete(deletePost)

userRouter
.route('/likePost')
.post(likePost)

userRouter
.route('/likedPostsArr')
.post(getUserLikedPostsArr)

userRouter
.route('/postsArr/:id')
.get(getPostsWithUserId)

userRouter
.route('/comment')
.post(createComment)

userRouter
.route('/comment/:id')
.get(getCommentById)

userRouter
.route('/commentsArr')
.post(getCommentsArrFromPostId)

userRouter
.route('/updateProfile')
.patch(updateProfile)

userRouter
.route('/handleFollowing')
.post(handleFollowing)

userRouter
.route('/notifications')
.post(getUserNotifications)

userRouter
.route('/notification/:id')
.get(getNotificationById)

userRouter
.route('/deleteNotification')
.post(deleteNotificationById)

userRouter
.route('/notificationResolved')
.post(notificationResolved);

userRouter
.route('/:id')
.get(getUserById);

module.exports = userRouter;