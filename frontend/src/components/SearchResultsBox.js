import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchResultsBox(props) {

    const navigate = useNavigate()

    const [isUsersButtonClicked, setIsUsersButtonClicked] = useState(true);
    const [isPostsButtonClicked, setIsPostsButtonClicked] = useState(false);

    const [users, setUsers] = useState();
    const [posts, setPosts] = useState();

    const [usersButtonStyle, setUsersButtonStyle] = useState();
    const [postsButtonStyle, setPostsButtonStyle] = useState();

    useEffect(() => {
        async function fetchData() {
            let usersArr = (await axios.get('/user/all')).data.data;
            setUsers(usersArr);
            let postsArr = (await axios.get('/user/post')).data.data;
            setPosts(postsArr);
        }
        fetchData();
    }, [])

    useEffect(() => {
        if(props.searchText != ""){
            document.getElementById('user').click()
        }
    },[props.searchText])

    const handleButonClick = (query) => {
        console.log(query);
        // set all to false 
        setIsUsersButtonClicked(false)
        setIsPostsButtonClicked(false);

        if (query == 'users') {
            setIsUsersButtonClicked(true);
            setUsersButtonStyle("font-bold")
            setPostsButtonStyle()
        } else if (query == 'posts') {
            setIsPostsButtonClicked(true);
            setPostsButtonStyle("font-bold")
            setUsersButtonStyle();
        }
    }

    const goToProfile = (uid) => {
        props.setIsSearchResultBoxOpen(false);
        navigate(`/otherProfile/${uid}`)
    }

    const goToPost = (postId) => {
        props.setIsSearchResultBoxOpen(false);
        navigate(`/post/${postId}`)
    }

    return (
        <div className="absolute rounded-2xl px-4 pb-4 mt-2 pt-2 min-h-fit max-h-72 w-full bg-white overflow-auto text-xl">
            {
                props.searchText == "" ? <div></div> :
                    <div>
                        <div className="flex justify-around">
                            <div>
                                <button id="user" className={usersButtonStyle} onClick={() => handleButonClick("users")}>Users</button>
                            </div>
                            <div>
                                <button className={postsButtonStyle} onClick={() => handleButonClick("posts")}>Posts</button>
                            </div>
                        </div>
                        {
                            !isUsersButtonClicked ? <div></div> :
                                !users ? <div></div> :
                                    users.filter((user, index) => {
                                        console.log(user.name, index);
                                        return user.name.toLowerCase().includes(props.searchText.toLowerCase())
                                    }).map((user, index) => (
                                        <div 
                                        className="cursor-pointer" 
                                        onClick={() => goToProfile(user._id)} 
                                        key={`${index}-${user._id}`}>
                                            {user.name}
                                        </div>
                                    ))
                        }

                        {
                            !isPostsButtonClicked ? <div></div> :
                                !posts ? <div></div> :
                                    posts.filter((post, index) => {
                                        return post.post.toLowerCase().includes(props.searchText.toLowerCase())
                                    }).map((post, index) => (
                                        <div 
                                        className="cursor-pointer"
                                        onClick={() => goToPost(post._id)}
                                        key={`${index}-${post._id}`}>
                                            {post.post}
                                        </div>
                                    ))
                        }
                    </div>
            }

        </div>
    )
}

export default SearchResultsBox;