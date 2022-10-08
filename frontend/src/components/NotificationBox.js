import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../actions/notificationActions';
import NotificationItem from './NotificationItem';

function NotificationBox (props) {
    console.log("notification box rendered")

    let {notificationObj} = useSelector((state) => state.notificationsFetchReducer);

    return (
        <div className="absolute -left-20 mt-2 w-72 min-h-fit max-h-72 bg-white overflow-auto">
            
            {
                !notificationObj ? <div></div> :
                notificationObj.pendingNotificationsArr.map((notificationId, index) => (
                    <NotificationItem resolved={false} notificationId={notificationId} key={`${index}-${notificationId}`}></NotificationItem>
                ))
            }
            {
                !notificationObj ? <div></div> :
                notificationObj.resolvedNotificationsArr.map((notificationId, index) => (
                    <NotificationItem resolved={true} notificationId={notificationId} key={`${index}-${notificationId}`}></NotificationItem>
                ))
            }

        </div>
    )
}

export default NotificationBox;