require('dotenv').config()
const userModel = require('../Models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const JWT_KEY = process.env.JWT_KEY
const notificationModel = require('../Models/notificationModel');

async function getAllUsers (req, res) {
    try {
        let users = await userModel.find({});
        if(users) {
            return res.json({
                message: 'Users retreived successfully',
                data: users
            })
        } else {
            return res.json({
                message: 'Users not found'
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function signup (req, res) {
    console.log("backend signup function called")
    try {
        let dataObj = req.body;
        let {password, confirmPassword} = dataObj
        let salt = await bcrypt.genSalt();
        let hash = await bcrypt.hash(dataObj.password, salt);
        dataObj.password = hash;
        if(password == confirmPassword){
            let user = await userModel.create(dataObj);
            if(user) {
                return res.json({
                    message: 'User signed up',
                    data: user
                })
            } else {
                return res.json({
                    message: 'Something went wrong. Please try again',
                })
            }
        } else {
            return res.json({
                message: 'Wrong Credentials',
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function login (req, res) {
    try {
        let dataObj = req.body;
        let user = await userModel.findOne({"email": dataObj.email});
        const match = await bcrypt.compare(req.body.password, user.password);
        if(match) {
            let token = jwt.sign({payload: user["_id"]}, JWT_KEY);
            res.cookie('loginToken', token, {maxAge: 1000*60*10});
            return res.json({
                message: "User found",
                data: user
            })
        } else {
            return res.json({
                message: "Error while logging in",
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function protectRoute(req, res, next) {
    try {
        if(req.cookies.loginToken){
            let token = req.cookies.loginToken;
            let payload = jwt.verify(token, JWT_KEY);
            let user = await accModel.findOne({"_id":payload.payload});
            if(user){
                req.user = user;
                req.id = user.id;
                next();
            } else {
                return res.json({
                    message: "Invalid User"
                })
            }
        } else {
            return res.json({
                message: "Please login"
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function getUser (req, res) {
    try {
        let id = req.params.id;
        let user = await userModel.findOne({"_id": id});
        if(user) {
            return res.json({
                message: 'User retreived',
                data: user
            })
        } else {
            return res.json({
                message: 'User not found'
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function updateUser (req, res) {
    try {
        let id = req.params.id;
        let updateObj = req.body;
        let user = await userModel.findOne({"_id": id});
        if(user) {
            let keys = [];
            for(let key in updateObj) {
                keys.push(key);
            }
            for(let key in keys){
                user[key] = updateObj[key];
            }
            await user.save();
            return res.json({
                message: 'User updated successfully',
                data: user
            })
        } else {
            return res.json({
                message: err.message
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function deleteUser (req, res) {
    try {
        let id = req.params.id;
        let user = await userModel.findByIdAndDelete({"_id": id});
        if(user){
            return res.json({
                message: 'User deleted successfully',
                data: user
            })
        } else {
            return res.json({
                message: 'User not found'
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function getUserLikedPostsArr (req, res) {
    try {
        let {uid} = req.body
        let likedPostsArr = (await userModel.findOne({"_id": uid})).likedPosts;
        if(likedPostsArr){
            return res.json({
                message: 'User Liked Posts arr retreived',
                data: likedPostsArr
            })
        } else {
            return res.json({
                message: 'User Liked Posts arr not found'
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function updateProfile (req, res) {
    try {
        let updateObj = req.body;
        let uid = updateObj._id;
        delete updateObj._id;
        let user = (await userModel.findOneAndUpdate({"_id": uid}, {$set:updateObj}));
        user.profileImage = updateObj.profileImage;
        return res.json({
            message: "Profile image updated successfully",
            data: user
        })
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function getUserById (req, res) {
    try {
        let uid = req.params.id;
        let user = (await userModel.findOne({"_id": uid}));
        if(user) {
            return res.json({
                message: "User Found",
                data: user
            })
        } else {
            return res.json({
                message: "User not found",
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function handleFollowingNotificationHandler (userAId, userBId) {
    let username = (await userModel.findOne({"_id": userAId})).name;
    let receivers = [userBId]
    let notificationObj = {
        type: "follow",
        generatedByUser: userAId,
        targetUserId: userAId,
        receivers,
        content: `${username} started following you`
    }
    let notification = await notificationModel.create(notificationObj)
    await userModel.findOneAndUpdate({"_id": userBId}, {$push:{"pendingNotifications": notification._id}})
}

async function addBToFollowingListOfA (userObj) {
    try {
        let {userAId, userBId} = userObj;
        let followingArr = (await userModel.findOne({"_id": userAId})).following;
        let ind = followingArr.indexOf(userBId);
        if(ind==-1){
            // following for the first time
            followingArr.push(userBId);
        } else {
            // already following, now remove from following
            followingArr.splice(ind, 1);
        }
        await userModel.findOneAndUpdate({"_id": userAId}, {$set:{"following": followingArr}});
        let user = await userModel.findOne({"_id": userAId});
        if(ind == -1){
            // send notification
            await handleFollowingNotificationHandler(userAId, userBId)
        }
        return user;
    } catch (err) {
        return err;
    }
}

async function addAToFollowerListOfB (userObj) {
    try {
        let {userAId, userBId} = userObj;
        let followerArr = (await userModel.findOne({"_id": userBId})).followers;
        let ind = followerArr.indexOf(userAId);
        if(ind==-1){
            // follower for the first time
            followerArr.push(userAId);
        } else {
            // already following, now remove from following
            followerArr.splice(ind, 1);
        }
        await userModel.findOneAndUpdate({"_id": userBId}, {$set:{"followers": followerArr}});
        let user = await userModel.findOne({"_id": userBId});
        return user;
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function handleFollowing (req, res) {
    try {
        
        let userA = await addBToFollowingListOfA(req.body);
        let userB = await addAToFollowerListOfB(req.body);
        return res.json({
            message: "Updated following and followers list",
            data: {
                userA,
                userB
            }
        })
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function getUserNotifications (req, res) {
    try {
        let {uid} = req.body;
        let pendingNotificationsArr = (await userModel.findOne({"_id" : uid})).pendingNotifications;
        let resolvedNotificationsArr = (await userModel.findOne({"_id" : uid})).resolvedNotifications;
        if(pendingNotificationsArr) {
            return res.json({
                message: 'Pending notifications array retreived',
                data: {
                    pendingNotificationsArr,
                    resolvedNotificationsArr
                }
            })
        } else {
            return res.json({
                message: 'Problem while retreiving pending notifications array'
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

module.exports = {
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
}