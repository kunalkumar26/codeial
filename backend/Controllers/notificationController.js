require('dotenv').config()
const notificationModel = require('../Models/notificationModel')
const userModel = require('../Models/userModel')


async function getNotificationById (req, res) {
    let nid = req.params.id
    try {
        let notification = await notificationModel.findOne({"_id": nid})
        if(notification) {
            return res.json({
                message: "notification found",
                data: notification
            })
        } else {
            return res.json({
                message: "notification not found"
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function notificationResolved (req, res) {
    try {
        let {nid, uid} = req.body;
        // remove from pending
        let pendingNotificationsArr = (await userModel.findOne({"_id": uid})).pendingNotifications;
        let resolvedNotificationsArr = (await userModel.findOne({"_id": uid})).resolvedNotifications;
        let ind = pendingNotificationsArr.indexOf(nid);
        if(ind != -1) {
            pendingNotificationsArr.splice(ind, 1);
            resolvedNotificationsArr.push(nid);
            await userModel.findOneAndUpdate({"_id": uid}, {
                $set:{"pendingNotifications": pendingNotificationsArr},
                $push:{"resolvedNotifications": nid}
            });
            // add to resolved
            return res.json({
                message: "Resolved Notification arr updated",
                data: {
                    pendingNotificationsArr,
                    resolvedNotificationsArr
                }
            })
        } else {
            return res.json({
                message: "Notification not found"
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

async function deleteNotificationById (req, res) {
    try {
        let {notificationId, uid} = req.body;
        // step 1 -> remove notiId from users Resolved notification array
        let resolvedNotificationsArr = (await userModel.findOne({"_id": uid})).resolvedNotifications
        let ind = resolvedNotificationsArr.indexOf(notificationId)
        resolvedNotificationsArr.splice(ind, 1)
        await userModel.findOneAndUpdate({"_id": uid}, {$set:{"resolvedNotifications": resolvedNotificationsArr}})
        // step 2 -> remove user from notification receivers array
        let receivers = (await notificationModel.findOne({"_id": notificationId})).receivers;
        let notification;
        if(receivers.length > 1){
            let userInd = receivers.indexOf(uid)
            receivers.splice(userInd, 1);
            await notificationModel.findOneAndUpdate({"_id": notificationId}, {$set:{"receivers": receivers}});
            notification = await notificationModel.findOne({"_id": notificationId})
        } else {
            notification = await notificationModel.findOneAndDelete({"_id": notificationId})
        }
        if(notification){
            return res.json({
                message: "Deleted notification successfully",
                data: notification
            })
        } else {
            return res.json({
                message: "Couldn't delete notification'"
            })
        }
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

module.exports = {
    getNotificationById,
    notificationResolved,
    deleteNotificationById
}