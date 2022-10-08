import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { FaRegThumbsUp } from 'react-icons/fa';
import { FaThumbsUp } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { USER_LIKED_POSTS_FETCH_DEC, USER_LIKED_POSTS_FETCH_INC } from '../constants/userConstants';
import CommentParent from './CommentParent';

function SinglePost() {
    let { postId } = useParams()
    console.log(postId)
    let [post, setPost] = useState();
    let [numLikes, setNumLikes] = useState();
    let [numComments, setNumComments] = useState();
    
    let [user, setUser] = useState();
    let [isPostLiked, setIsPostLiked] = useState(false);
    let { userInfo } = useSelector((state) => state.userLoginReducer);
    let { userLikedPostsArr } = useSelector((state) => state.userLikedPostsArrReducer);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (userLikedPostsArr && post) {
            // console.log("use effect rendered")
            let ind = userLikedPostsArr.indexOf(post._id);
            if (ind != -1) {
                setIsPostLiked(true);
            } else {
                setIsPostLiked(false);
            }
        }
    }, [post, isPostLiked, userLikedPostsArr])

    useEffect(() => {
        async function fetchData() {
            let postObj = (await axios.get(`/user/post/${postId}`)).data.data;
            if(postObj){
                setPost(postObj);
                setNumLikes(postObj.likes)
                setNumComments(postObj.comments.length)
                let user = (await axios.get(`/user/${postObj.user}`)).data.data;
                setUser(user);
            }
        }
        fetchData();
    },[postId])

    const visitOtherProfile = () => {
        console.log("Visiting other person profile")
        navigate(`/otherProfile/${post.user}`);
    }

    const incNumComments = () => {
        setNumComments(numComments + 1);
    }

    const updateNumLikes = () => {
        // 1. update the likedposts array of user -> check if the user already liked the post or not
        // let postId = post._id;
        let req = axios.post('/user/likePost', { uid: userInfo._id, postId });
        req.then((response) => {
            console.log(response);
            let { updated } = response.data;
            if (updated == 1) {
                // increment post likes
                setNumLikes(numLikes + 1);
                dispatch({ type: USER_LIKED_POSTS_FETCH_INC, payload: postId })
                setIsPostLiked(true);
            } else if (updated == -1) {
                // decrement post likes
                setNumLikes(numLikes - 1);
                dispatch({ type: USER_LIKED_POSTS_FETCH_DEC, payload: postId })
                setIsPostLiked(false);
            }
            // dispatch(fetchUserLikedPosts(userInfo._id))
        })

        // 2. update the like count of the post -> already done on the backend.
    }

    return (
        <div className="mt-28">
            {
                !post ? <div></div> :
                    <div>
                        <div className="bg-white w-3/6 mx-32 mt-6 px-8 pt-4 pb-2 rounded divide-y divide-slate-300">
                            <div className="font-medium text-2xl pb-1">
                                {
                                    !user ? <div></div> :
                                        <div onClick={visitOtherProfile} className=" flex justify-start space-x-2 pb-1">
                                            <img className="hover:cursor-pointer" style={{ height: 50, width: 50, borderRadius: 50 }} src={user.profileImage}></img>
                                            <span className="hover:cursor-pointer text-slate-500 text-xl"> {user.name} </span>
                                        </div>
                                }
                                {post.heading}
                            </div>
                            <div className="whitespace-pre pt-2 pb-1">
                                {post.post}
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
                            <CommentParent incNumComments={incNumComments} postId={post._id}></CommentParent>
                        </div>
                    </div>
            }
        </div>
    )
}

export default SinglePost;