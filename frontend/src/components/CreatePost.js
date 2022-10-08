import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

const {createPost, fetchPosts} = require('../actions/postActions')

function CreatePost() {
    // console.log("CreatePost rendered")
    let { userInfo } = useSelector((state) => state.userLoginReducer);
    let [text, setText] = useState("");
    let [heading, setHeading] = useState("");
    let dispatch = useDispatch();
    const navigate = useNavigate();
    const createPostHandler = (e) => {
        e.preventDefault();
        dispatch(createPost(heading, text, userInfo._id));
        setText("");
        setHeading("");
    }
    useEffect(() => {
        console.log("use effect of create post")
    },[])
    if (!userInfo) {
        return (
            <Navigate replace to="/"></Navigate>
        )
    }
    return (
        <div className="mx-6 my-6 mt-28">
            <div className="text-white text-2xl">Heading</div>
            <textarea onChange={(e) => setHeading(e.target.value)} value={heading} rows="1" 
            className=" resize-none	my-2 block p-2.5 w-4/6 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 outline-none" 
            placeholder="Heading..."></textarea>
            <div className="text-white text-2xl">Content</div>
            <textarea onChange={(e) => setText(e.target.value)} value={text} rows="18" 
            className=" resize-none	 block p-2.5 w-4/6 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 outline-none" 
            placeholder="Your message..."></textarea>
            <button onClick={createPostHandler} 
            className="mx-6 my-6 py-2 px-4 rounded text-2xl text-white font-bold bg-purple-500 hover:bg-purple-700">Post</button>
        </div>
    )
}

export default CreatePost;