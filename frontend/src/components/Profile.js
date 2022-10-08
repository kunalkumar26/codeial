import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from "react-router-dom";
import PostCard from './PostCard';
import { fetchPostsWithUserId } from '../actions/postActions'
import axios from 'axios';
import { storage } from '../firebase'
import { USER_LOGIN_UPDATE } from '../constants/userConstants';

function Profile() {
    // console.log("Profile rendered")
    const navigate = useNavigate()
    let {userInfo} = useSelector((state) => state.userLoginReducer);
    let [userPostsArr, setUserPostsArr] = useState();
    const removeFromUserPostsArr = (postId) => {
        let oldArr = [...userPostsArr]
        console.log("before removing", userPostsArr)
        let ind = -1;
        for (let i = 0; i < userPostsArr.length; i++) {
            if (userPostsArr[i]._id == postId) {
                ind = i;
                break;
            }
        }
        if (ind != -1) {
            // let ind = oldArr.indexOf(postId);
            console.log("ind", ind);
            oldArr.splice(ind, 1);
            console.log("after removing", oldArr)
            setUserPostsArr(oldArr);
        }
    }
    const goToWall = () => {
        navigate("/wall")
    }
    const dispatch = useDispatch();
    useEffect(() => {
        if (userInfo) {
            async function fetchData() {
                let uid = userInfo._id
                let resp = await axios.get(`/user/postsArr/${uid}`)
                if(resp.data.data) {
                    setUserPostsArr(resp.data.data);
                    dispatch(fetchPostsWithUserId(userInfo._id));
                    let res = axios.get(`/user/${userInfo._id}`)
                    res.then((response) => {
                        dispatch({type: USER_LOGIN_UPDATE, payload: response.data.data})
                    })
                }
            }
            fetchData();
        }
    }, [])

    const changeProfilePic = async () => {
        const uploadTask = storage.ref(`/data/${userInfo.name}-${userInfo._id}`).put(file);
        uploadTask.on("state_changed", fn1, fn2, fn3);
        function fn1(snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Uploading", progress)
        }
        function fn2(err) {
            console.log("error", err)
        }
        function fn3() {
            console.log("Profile Pic Uploaded successfully")

            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                console.log(url);
                let updateObj = {
                    _id: userInfo._id,
                    profileImage: url
                }
                let resp = axios.patch('/user/updateProfile', updateObj)
                resp.then((response) => {
                    if(response.data.data){
                        console.log("Profile Image Updated successfully");
                        dispatch({type: USER_LOGIN_UPDATE, payload: response.data.data});
                    } else {
                        console.log("Profile Image not updated")
                    }
                })
            })
        }

    }

    let [file, setFile] = useState("");
    if (!userInfo) {
        return <Navigate replace to="/"></Navigate>
    } else {
        return (
            <div className="mt-28">
                <div className="flex justify-around shadow-2xl w-3/6 mx-32 my-6 px-8 py-4 rounded text-center">
                    <div>
                        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}></input>
                        <button onClick={changeProfilePic}>Upload</button>
                    </div>
                    <div className=" flex justify-center items-center">
                        <img className="cursor-pointer" style={{ height: 100, width: 100, borderRadius: 25 }} src={userInfo.profileImage} ></img>
                    </div>
                    <div >
                        <div className="text-4xl font-bold">
                            {userInfo.name}
                        </div>
                        <div className="text-2xl">
                            Email : {userInfo.email}
                            <br></br>
                            No. of Posts : {
                                userPostsArr ? userPostsArr.length : "Fetching posts..."
                            }
                            <br></br>
                            Following : {userInfo.following.length}
                            <br></br>
                            Followers : {userInfo.followers.length}
                        </div>
                    </div>
                </div>
                
                {
                    !userPostsArr ? <div></div> :
                        <div className="flex flex-wrap justify-evenly items-center w-3/6 mx-32 my-6 pb-3 rounded ">
                            {/* <PostCard heading={"trial"} post={"this is a trial post"}></PostCard> */}
                            {
                                userPostsArr.slice(0).reverse().map((postObj, index) => (
                                    <PostCard removeFromUserPostsArr={removeFromUserPostsArr} postObj={postObj} key={index} index={index}></PostCard>
                                ))
                            }
                        </div>
                }
            </div>
        )
    }
}

export default Profile;