import axios from 'axios';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'
import { useSelector } from 'react-redux';

import {ENDPOINT} from '../secret'

const socket = io.connect(ENDPOINT)

function CommentBox(props) {

    let [comment, setComment] = useState()
    let { userInfo } = useSelector((state) => state.userLoginReducer);

    const createCommentHandler = async (e) => {
        let c = comment;
        console.log(c);
        setComment("")
        let user = userInfo._id;
        let postId = props.postId;
        let response = await axios.post('/user/comment', { comment, user, post: postId });

        if (response.data.data) {
            // comment generated -> emit here
            let resp = await axios.get(`/user/post/${response.data.data.post}`);
            if(resp) {
                socket.emit('comment-created', resp.data.data.user);
            }
            console.log(response.data);
            let commentId = response.data.data._id;
            console.log("i commented ", response.data.data.comment)
            props.getLatestCommentId(commentId, response.data.data.comment);
            props.incNumComments();
        }
    }

    useEffect(() => {
        setComment("")
    }, [])

    return (
        <div>
            <div className="flex justify-between">
                <div className="w-5/6 ">
                    <textarea onChange={(e) => setComment(e.target.value)} value={comment}
                        className="resize-none mx-2 h-8 w-full outline-none"
                        placeholder="Start typing your comment here..."></textarea>
                </div>
                <div >
                    <button onClick={createCommentHandler} className="text-white font-bold py-1 px-2 rounded
                 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Comment</button>
                </div>
            </div>
        </div>
    )
}

export default CommentBox;