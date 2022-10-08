import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { USER_LOGIN_UPDATE } from '../constants/userConstants';
import io from 'socket.io-client'

import {ENDPOINT} from '../secret'

const socket = io.connect(ENDPOINT)

function OtherProfile() {
    let { userId } = useParams()
    let { userInfo } = useSelector((state) => state.userLoginReducer);
    let [user, setUser] = useState();
    const navigate = useNavigate();
    const [isAFollowingB, setIsAFollowingB] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userId == userInfo._id) {
            navigate('/profile')
        } else {
            let resp = axios.get(`/user/${userId}`);
            resp.then((response) => {
                if (response.data.data) {
                    setUser(response.data.data);
                    let followerArr = response.data.data.followers;
                    let ind = followerArr.indexOf(userInfo._id);
                    if (ind != -1) {
                        setIsAFollowingB(true);
                    } else {
                        setIsAFollowingB(false);
                    }
                }
            })
        }
    }, [isAFollowingB, userId])

    const followThisUser = async () => {
        console.log("follow this user")
        // A -> B
        // 1. add B to following list of A
        // 2. add A to followers list of B
        let res = await axios.post('/user/handleFollowing', { userAId: userInfo._id, userBId: userId });
        dispatch({type: USER_LOGIN_UPDATE, payload: res.data.data.userA});
        console.log(res.data)
        let followingArr = res.data.data.userA.following;
        let ind = followingArr.indexOf(userId);
        if (ind != -1) {
            socket.emit('started-following-user', res.data.data.userB._id);
            setIsAFollowingB(true);
        } else {
            setIsAFollowingB(false);
        }
    }

    if (!userInfo) {
        return (
            <Navigate replace to="/"></Navigate>
        )
    }

    return (
        !user ? <div className="mt-28">Loading users info...</div> :
            <div className="mt-28">
                <div className="flex justify-around shadow-2xl w-3/6 mx-32 my-6 px-8 py-4 rounded text-center">
                    <div className=" flex justify-center items-center">
                        <img style={{ height: 100, width: 100, borderRadius: 25 }} src={user.profileImage} ></img>
                    </div>
                    <div >
                        <div className="text-4xl font-bold">
                            {user.name}
                        </div>
                        <div className="text-2xl">
                            Email : {user.email}
                            <br></br>
                            No. of Posts : {
                                user.posts.length
                            }
                            <br></br>
                            Following : {user.following.length}
                            <br></br>
                            Followers : {user.followers.length}
                        </div>
                    </div>
                </div>

                <div >
                    {
                        !isAFollowingB ?
                            <button onClick={followThisUser} className="mx-32 my-6 text-white font-bold py-1 px-2 rounded
                 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Follow</button>
                            :
                            <button onClick={followThisUser} className="mx-32 my-6 text-white font-bold py-1 px-2 rounded
                 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">UnFollow</button>
                    }

                </div>
            </div>
    )
}

export default OtherProfile;