import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import { FiChevronDown } from 'react-icons/fi'
import { FiChevronUp } from 'react-icons/fi'
import { HiOutlineLogout } from 'react-icons/hi';
import { BsPerson } from 'react-icons/bs'
import { BiPencil } from 'react-icons/bi'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux';
import NotificationBox from './NotificationBox';
import io from 'socket.io-client'
import {ENDPOINT} from '../secret'
import SearchResultsBox from './SearchResultsBox';
import { USERS_ONLINE_UPDATE } from '../constants/userConstants';
const { logOut } = require('../actions/userActions')
const { fetchNotifications } = require('../actions/notificationActions')

let name = "< codeial />"

const socket = io.connect(ENDPOINT)

function Navbar() {
    console.log("Navbar rendered")
    const [isNotificationBoxOpen, setIsNotificationBoxOpen] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [isSearchResultBoxOpen, setIsSearchResultBoxOpen] = useState(false)
    const [notiCount, setNotiCount] = useState()
    let { userInfo } = useSelector((state) => state.userLoginReducer);

    let dispatch = useDispatch()
    const navigate = useNavigate();
    const goToWall = () => {
        navigate('/wall');
    }
    const goToProfilePage = () => {
        navigate('/profile');
    }
    const goToPost = () => {
        navigate('/post');
    }
    const logOutHandler = () => {
        navigate('/')
        dispatch(logOut());
        socket.emit('logout', userInfo._id);
    }

    const openNotifications = () => {
        if (isNotificationBoxOpen) {
            setIsNotificationBoxOpen(false)
        } else {
            setIsNotificationBoxOpen(true)
        }
    }

    const updateNotiCount = (count) => {
        setNotiCount(count);
    }

    let { notificationObj } = useSelector((state) => state.notificationsFetchReducer);

    useEffect(() => {
        if (userInfo) {
            socket.emit('user-joined', userInfo._id);
            dispatch(fetchNotifications(userInfo._id))
        }
    }, [userInfo])

    useEffect(() => {
        if (notificationObj) {
            console.log("asdfasdfsdf", notiCount, notificationObj.pendingNotificationsArr.length)
            if (notiCount != notificationObj.pendingNotificationsArr.length) {
                console.log('changing noti count')
                setNotiCount(notificationObj.pendingNotificationsArr.length);
            }
        }
    }, [notificationObj])

    useEffect(() => {
        socket.on('receive-post', () => {
            console.log("receive-post");
            dispatch(fetchNotifications(userInfo._id))
        })
        socket.on('receive-comment', () => {
            console.log("receive-comment");
            dispatch(fetchNotifications(userInfo._id))
        })
        socket.on('receive-likedPost', () => {
            console.log("receive-likedPost");
            dispatch(fetchNotifications(userInfo._id))
        })
        socket.on('receive-following-request', () => {
            console.log("receive-followingRequest");
            dispatch(fetchNotifications(userInfo._id))
        })
        socket.on('user-online', (usersArr) => {
            console.log('new user is online')
            console.log(usersArr)
            // setOnlineUsers(usersArr);
            // dispatch here
            dispatch({type: USERS_ONLINE_UPDATE, payload: usersArr})
        })
    }, [socket])

    useEffect(() => {
        if (searchText == "") {
            setIsSearchResultBoxOpen(false)
        } else {
            setIsSearchResultBoxOpen(true)
        }
    }, [searchText])

    const openNotificationBox = () => {
        setIsSearchResultBoxOpen(true)
    }

    const closeNotificationBox = () => {
        setIsSearchResultBoxOpen(false)
    }

    return (
        <>
            <div className="fixed z-10 w-full flex justify-between bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-20 text-3xl text-white py-4 px-4">
                <div onClick={goToWall} className="cursor-pointer flex justify-center items-center">{name}</div>

                {
                    !userInfo ? <div></div> :
                        <div className="flex justify-center items-center space-x-16">
                            <div

                                className="relative text-slate-600 ">
                                <div className="flex h-10 relative">
                                    <input
                                        className="rounded-2xl outline-none w-96 px-4 text-xl" onChange={(e) => setSearchText(e.target.value)} value={searchText} placeholder="Search..."></input>
                                    {
                                        !isSearchResultBoxOpen ?
                                            <div onClick={openNotificationBox} className="cursor-pointer flex justify-center items-center">
                                                <div className="absolute right-0 px-2">
                                                    <FiChevronDown></FiChevronDown>
                                                </div>
                                            </div> :
                                            <div onClick={closeNotificationBox} className="cursor-pointer flex justify-center items-center">
                                                <div className="absolute right-0 px-2">
                                                    <FiChevronUp></FiChevronUp>
                                                </div>
                                            </div>
                                    }

                                </div>
                                {
                                    !isSearchResultBoxOpen ? <div></div> :
                                        <div>
                                            <SearchResultsBox setIsSearchResultBoxOpen={setIsSearchResultBoxOpen}
                                                searchText={searchText}></SearchResultsBox>
                                        </div>
                                }
                            </div>
                            <div onClick={goToPost} className="cursor-pointer hover:bg-pink-600 hover:rounded-lg h-12 w-12 flex justify-center items-center">
                                <BiPencil></BiPencil>
                            </div>
                            <div className="relative">
                                <NotificationBadge
                                    count={notiCount}
                                    effect={Effect.SCALE}
                                />
                                <div onClick={openNotifications} className="cursor-pointer hover:bg-pink-600 hover:rounded-lg h-12 w-12 flex justify-center items-center">
                                    <IoIosNotificationsOutline></IoIosNotificationsOutline>
                                </div>
                                {isNotificationBoxOpen ? <NotificationBox updateNotiCount={updateNotiCount}></NotificationBox> : <></>}

                            </div>
                            <div onClick={goToProfilePage} className="cursor-pointer hover:bg-pink-600 hover:rounded-lg h-12 w-12 flex justify-center items-center">
                                <BsPerson></BsPerson>
                            </div>
                            <div onClick={logOutHandler} className="cursor-pointer hover:bg-pink-600 hover:rounded-lg h-12 w-12 flex justify-center items-center">
                                <HiOutlineLogout />
                            </div>
                        </div>
                }

            </div>
        </>
    )
}

export default Navbar;