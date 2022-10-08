import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
import { USERS_ONLINE_UPDATE } from '../constants/userConstants';

import {ENDPOINT} from '../secret'

const socket = io.connect(ENDPOINT)

function User(props) {

    const [user, setUser] = useState()
    const navigate = useNavigate();

    const {userInfo} = useSelector((state) => state.userLoginReducer)

    useEffect(() => {
        async function fetchData() {
            let resp = (await axios.get(`/user/${props.userId}`))
            if (resp.data.data) {
                setUser(resp.data.data);
            }
        }
        fetchData();
    }, [])

    return (
        <div className="text-xl">
            {
                !user ? <div></div> :
                    <div className="flex mt-3">
                        <div className="relative">
                            <div className="absolute right-0 bottom-0 h-4 w-4 bg-green-600 rounded-full"></div>
                            <img onClick={() => navigate(`/otherProfile/${user._id}`)} className="cursor-pointer h-12 w-12 rounded-full" src={user.profileImage}></img>
                        </div>
                        <div className="flex justify-center items-center text-slate-500 px-2">
                            {user.name}
                        </div>
                    </div>
            }
        </div>
    )
}

function OnlineUsers() {

    const {onlineUsers} = useSelector((state) => state.usersOnlineReducer);

    const dispatch = useDispatch();

    useEffect(() => {
        socket.emit('get-online-users');
    },[socket])

    return (
        <div className="w-full bg-white rounded-2xl pb-2 max-h-72 overflow-auto">
            <div className="px-3 pt-2 text-2xl">
                Online Users
            </div>
            <div className="px-3 mt-2">
                {
                    !onlineUsers ? <div></div> :
                        onlineUsers.map((userId, index) => (
                                <User userId={userId} key={`${index}-${userId}`}></User>
                            ))
                }
            </div>
        </div>
    )
}

export default OnlineUsers;