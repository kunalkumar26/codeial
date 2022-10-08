import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchPosts } from '../actions/postActions';
import Post from './Post';
import io from 'socket.io-client'
import OnlineUsers from './OnlineUsers';
import { fetchNotifications } from '../actions/notificationActions';

import {ENDPOINT} from '../secret'

const socket = io.connect(ENDPOINT)

function Wall() {
    // console.log("Wall rendered")
    let { userInfo } = useSelector((state) => state.userLoginReducer);
    let { loading, error } = useSelector((state) => state.postsFetchReducer);
    let dispatch = useDispatch();
    let { postsArr } = useSelector((state) => state.postsFetchReducer)
    let { onlineUsers } = useSelector((state) => state.usersOnlineReducer);
    if (onlineUsers) {
        console.log("adsasd", onlineUsers)
    }
    useEffect(() => {
        console.log("rendered")
        dispatch(fetchPosts());
    }, [])

    useEffect(() => {
        socket.on('receive-post', () => {
            dispatch(fetchPosts());
            dispatch(fetchNotifications(userInfo._id))
        })
    }, [socket])

    if (!userInfo) {
        return (
            <Navigate replace to="/"></Navigate>
        )
    }
    if (loading) {
        return (
            <div>Fetching posts...</div>
        )
    } else if (error) {
        return (
            <div>{error}</div>
        )
    } else if (postsArr) {
        return (
            <div className="relative mt-28">
                <div className=" pb-16">
                    {
                        postsArr.slice(0).reverse().map((post, index) => (
                            <div key={index}>
                                {
                                    !onlineUsers ? <Post post={post} key={index}></Post> :
                                    onlineUsers.indexOf(post.user) == -1 ?
                                        <Post post={post} key={index} isOnline={false}></Post> :
                                        <Post post={post} key={index} isOnline={true}></Post>
                                }
                            </div>
                        ))
                    }
                </div>
                <div className=" fixed right-16 top-36 w-1/4">
                    <OnlineUsers></OnlineUsers>
                </div>
            </div>
        )
    }
}

export default Wall