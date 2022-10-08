import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { FaRegThumbsUp } from 'react-icons/fa';
import { FaThumbsUp } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import CommentParent from './CommentParent';
import { USER_LIKED_POSTS_FETCH_DEC, USER_LIKED_POSTS_FETCH_INC } from '../constants/userConstants';
import { useNavigate } from 'react-router-dom';
import {ENDPOINT} from '../secret'
import io from 'socket.io-client';


const socket = io.connect(ENDPOINT)

function Post(props) {
    // console.log("Post rendered")
    let [numLikes, setNumLikes] = useState(props.post.likes);
    let [numComments, setNumComments] = useState(props.post.comments.length);
    let { userInfo } = useSelector((state) => state.userLoginReducer);
    let { userLikedPostsArr } = useSelector((state) => state.userLikedPostsArrReducer);
    let [isPostLiked, setIsPostLiked] = useState(false);
    let [user, setUser] = useState();
    let dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (userLikedPostsArr) {
            // console.log("use effect rendered")
            let ind = userLikedPostsArr.indexOf(props.post._id);
            if (ind != -1) {
                setIsPostLiked(true);
            } else {
                setIsPostLiked(false);
            }
        }
    }, [isPostLiked, userLikedPostsArr])
    const incNumComments = () => {
        setNumComments(numComments + 1);
    }
    const updateNumLikes = async () => {
        // 1. update the likedposts array of user -> check if the user already liked the post or not
        let postId = props.post._id;
        let res = await axios.post('/user/likePost', { uid: userInfo._id, postId });
        if(res.data.updated) {
            console.log(res.data);
            let { updated } = res.data;
            if (updated == 1) {
                // increment post likes
                setNumLikes(numLikes + 1);
                // liked for the first time -> emit here.

                let resp = await axios.get(`/user/post/${postId}`);
                if(resp.data.data) {
                    console.log("emitting here")
                    socket.emit('post-liked', resp.data.data.user);
                    console.log("adhasdfasdasdf")
                }

                dispatch({ type: USER_LIKED_POSTS_FETCH_INC, payload: postId })
                setIsPostLiked(true);
            } else if (updated == -1) {
                // decrement post likes
                setNumLikes(numLikes - 1);
                dispatch({ type: USER_LIKED_POSTS_FETCH_DEC, payload: postId })
                setIsPostLiked(false);
            }
        }

        // 2. update the like count of the post -> already done on the backend.
    }
    useEffect(() => {
        async function fetchData() {
            let user = (await axios.get(`/user/${props.post.user}`)).data.data;
            setUser(user);
        }
        fetchData();
    }, [])

    const visitOtherProfile = () => {
        console.log("Visiting other person profile")
        navigate(`/otherProfile/${props.post.user}`);
    }

    return (
        <div>
            <div className="bg-white w-3/6 mx-32 mt-6 px-8 pt-4 pb-2 rounded divide-y divide-slate-300">
                <div className="font-medium text-2xl pb-1">
                    {
                        !user ? <div></div> :
                            <div onClick={visitOtherProfile} className=" flex justify-start space-x-2 pb-1">
                                <div className="relative">
                                    <img className="hover:cursor-pointer" style={{ height: 50, width: 50, borderRadius: 50 }} src={user.profileImage}></img>
                                    {
                                        !props.isOnline ? <div></div> :
                                            <div className="absolute right-0 bottom-0 h-4 w-4 bg-green-600 rounded-full"></div>
                                    }
                                </div>
                                <span className="hover:cursor-pointer text-slate-500 text-xl"> {user.name} </span>
                            </div>
                    }
                    {props.post.heading}
                </div>
                <div className="whitespace-pre pt-2 pb-1">
                    {props.post.post}
                </div>
                <div className="flex space-x-8 text-slate-500 py-1">
                    <div className="flex justify-center items-center">
                        {
                            isPostLiked == false ?
                                (
                                    <div onClick={updateNumLikes} className="cursor-pointer">
                                        <FaRegThumbsUp></FaRegThumbsUp>
                                    </div>
                                ) :
                                (
                                    <div onClick={updateNumLikes} className="cursor-pointer">
                                        <FaThumbsUp></FaThumbsUp>
                                    </div>
                                )
                        }

                        <div className="mx-2">
                            {numLikes}
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="cursor-pointer">
                            <BiCommentDetail></BiCommentDetail>
                        </div>
                        <div className="mx-2">
                            {numComments}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white w-3/6 mx-32 px-8 py-4 my-0.5 rounded divide-y divide-slate-300">
                <CommentParent incNumComments={incNumComments} postId={props.post._id}></CommentParent>
            </div>
        </div>
    )
}

export default Post;