import React, { useEffect, useState } from 'react';
import Comment2 from './Comment2';
function CommentsList(props) {
    if (props.commentsIdArr) {
        // console.log("inside comments list", props.commentsIdArr);
    }
    
    return (
        <div>
            {
                !props.commentsIdArr ? <div></div> :
                    props.commentsIdArr.slice(0).reverse().map((commentId, index) =>
                        // console.log(commentId, index);
                        (
                            <Comment2 commentId={commentId} key={`${index}-${commentId}`} ></Comment2>
                        )
                    )
            }
        </div>
    )
}

export default CommentsList