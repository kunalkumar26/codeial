import React from 'react';
import axios from 'axios';
import { FiDelete } from 'react-icons/fi'
import { FiExternalLink } from 'react-icons/fi'
import "../Styles/PostCard.css"
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsWithUserId } from '../actions/postActions';
import { Navigate, useNavigate } from 'react-router-dom';

function PostCard(props) {
    // console.log("PostCard rendered")
    // const dispatch = useDispatch();
    // let userInfo = useSelector((state) => state.userLoginReducer.userInfo);
    const navigate = useNavigate();

    const deletePost = () => {
        let resp = axios.delete(`/user/post/${props.postObj._id}`);
        resp.then((response) => {
            console.log("deleting post", response.data);
            if (response.data) {
                props.removeFromUserPostsArr(response.data.data._id)
            }
            // dispatch(fetchPostsWithUserId(userInfo._id));
        })
    }

    const openSinglePost = () => {
        console.log("open single post")
        navigate(`/post/${props.postObj._id}`)
    }

    return (
        <div className="post-card relative bg-white shadow-2xl w-1/4 h-40 mx-1 mt-3 rounded overflow-auto border-8 border-white">
            <div onClick={openSinglePost} className="delete-icon absolute right-0 text-3xl cursor-pointer flex justify-center items-center">
                <FiExternalLink></FiExternalLink>
            </div>
            <div onClick={deletePost} className="delete-icon absolute right-0 top-10 text-3xl cursor-pointer flex justify-center items-center">
                <FiDelete></FiDelete>
            </div>
            <div className="text-2xl">
                {props.postObj.heading}
            </div>
            <div>
                {props.postObj.post}
            </div>
        </div>
    )
}

export default PostCard;