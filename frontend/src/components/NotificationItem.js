import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications } from '../actions/notificationActions';
import { MdDelete } from 'react-icons/md'

function NotificationItem(props) {
    const [notification, setNotification] = useState();
    let { userInfo } = useSelector((state) => state.userLoginReducer);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navigateToTarget = () => {
        console.log("navigating")
        if (notification.type == "follow") {
            console.log("follow req")
            navigate(`/otherProfile/${notification.targetUserId}`)
        } else {
            console.log("other req")
            navigate(`/post/${notification.targetPostId}`)
        }
        if (props.resolved) {
            return;
        }
        // now move the notification from pending to resolved
        let res = axios.post('/user/notificationResolved', { nid: notification._id, uid: userInfo._id });
        res.then((response) => {
            console.log(response.data);
            if (response.data) {
                dispatch(fetchNotifications(userInfo._id))
            }
        })
    }

    useEffect(() => {
        let res = axios.get(`/user/notification/${props.notificationId}`);
        res.then((response) => {
            let notiObj = response.data.data;
            setNotification(notiObj);
        })
    }, [])

    const deleteThisNotification = async () => {
        console.log('deleteThisNotification')
        let resp = await axios.post(`/user/deleteNotification`, {notificationId: props.notificationId, uid: userInfo._id});
        console.log(resp.data);
        dispatch(fetchNotifications(userInfo._id))
    }

    return (
        <div className="cursor-pointer text-black text-xl my-1 px-2 min-h-8 max-h-fit">
            {
                !notification ? <div></div> :

                    !props.resolved ? <span onClick={navigateToTarget} className="font-bold">{notification.content}</span> :
                        <div className="relative ">
                            <div onClick={navigateToTarget}>{notification.content}</div>
                            <div className="absolute right-0 top-0 hover:bg-red-300 h-8 w-8 flex justify-center items-center">
                                <MdDelete onClick={deleteThisNotification} ></MdDelete>
                            </div>
                        </div>
            }
        </div>
    )
}

export default NotificationItem;