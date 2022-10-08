import axios from "axios"
import { 
    POST_CREATE_FAIL, 
    POST_CREATE_REQUEST, 
    POST_CREATE_SUCCESS, 
    POST_FETCH_FAIL, 
    POST_FETCH_REQUEST, 
    POST_FETCH_SUCCESS, 
    POST_FETCH_WITH_USER_ID_FAIL, 
    POST_FETCH_WITH_USER_ID_REQUEST, 
    POST_FETCH_WITH_USER_ID_SUCCESS 
} from '../constants/postConstants'
import { USER_LOGIN_UPDATE } from "../constants/userConstants";
import io from 'socket.io-client';

import {ENDPOINT} from '../secret'

const socket = io.connect(ENDPOINT)


export const createPost = (heading, post, user) => async (dispatch) => {
    try {
        dispatch({type: POST_CREATE_REQUEST})
        let resp = (await axios.post("/user/post", {heading, post, user}));
        if(resp){
            dispatch({type: POST_CREATE_SUCCESS, payload: resp.data.data});
            let userInfo = JSON.parse(localStorage.getItem("userInfo"));
            userInfo.posts.push(resp.data.data._id);
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            dispatch({type: USER_LOGIN_UPDATE, payload: userInfo});
            dispatch(fetchPosts());
            // post is created successfully -> emit here
            socket.emit("post-created");
        }
    } catch (error) {
        dispatch({type: POST_CREATE_FAIL, payload: error})
    }
}

export const fetchPosts = () => async (dispatch) => {
    try {
        dispatch({type: POST_FETCH_REQUEST})
        let postArr = (await axios.get('/user/post')).data.data;
        dispatch({type: POST_FETCH_SUCCESS, payload: postArr});
    } catch (error) {
        dispatch({type: POST_FETCH_FAIL, payload: error})
    }
}

export const fetchPostsWithUserId = (uid) => async (dispatch) => {
    try {
        dispatch({type: POST_FETCH_WITH_USER_ID_REQUEST});
        let postsArrWithUserId = (await axios.get(`/user/postsArr/${uid}`)).data.data;
        dispatch({type: POST_FETCH_WITH_USER_ID_SUCCESS, payload: postsArrWithUserId});
    } catch (error) {
        dispatch({type: POST_FETCH_WITH_USER_ID_FAIL, payload: error})
    }
}