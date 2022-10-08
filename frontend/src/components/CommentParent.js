import axios from 'axios';
import React, { useEffect, useState } from 'react';

import CommentBox2 from './CommentBox2'
import CommentsList from './CommentsList'

function CommentParent(props) {
    let [commentsIdArr, setCommentsIdArr] = useState();

    const getLatestCommentId = (commentId, comment) => {
        console.log("my comment was ", comment)
        let oldArr;
        if(!commentsIdArr){
            oldArr = []
        } else {
            oldArr = [...commentsIdArr];
        }
        console.log("comment arr before pushing commentId",oldArr);
        oldArr.push(commentId);
        console.log("comment arr after pushing commentId",oldArr);
        setCommentsIdArr(oldArr);
    }

    useEffect(() => {
        async function fetchData() {
            let resp = await axios.post('/user/commentsArr', { "_id": props.postId })
            let arr = resp.data.data;
            setCommentsIdArr(arr);
        }
        fetchData();
    }, [])
    return (
        <div>
            <CommentBox2 incNumComments={props.incNumComments} getLatestCommentId={getLatestCommentId} postId={props.postId}></CommentBox2>
            {
                !commentsIdArr ? <div></div> :
                    <div>
                        <CommentsList commentsIdArr={commentsIdArr}></CommentsList>
                    </div>
            }
        </div>
    )
}

export default CommentParent;