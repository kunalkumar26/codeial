import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Comment(props) {
    // console.log("Comment2 rendered");
    // console.log("final", props.commentId);

    let [c, setC] = useState();
    let [user, setUser] = useState();

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            // console.log("comment id is ", props.commentId)
            let data = (await axios.get(`/user/comment/${props.commentId}`)).data.data;
            // console.log("inside comment",data.comment);
            setC(data);
            let user = (await axios.get(`/user/${data.user}`)).data.data;
            setUser(user);
        }
        fetchData();
    }, [])

    if (c) {
        // console.log("this is the comment",props.commentId, c.comment);
        return (
            <div className="bg-[#e2e8f0] px-3 py-2 mt-2 flex">
                <div>
                    {
                        !user ? <div></div> :
                            <img onClick={() => navigate(`/otherProfile/${user._id}`)} className="w-8 h-8 rounded-full cursor-pointer" src={user.profileImage}></img>
                    }
                </div>
                <div className="">
                    {
                        !user ? <div></div> :
                            <span className="font-bold px-2">
                                {user.name}
                            </span>
                    }
                    <span className="">
                        {c.comment}
                    </span>
                </div>
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}

export default Comment;