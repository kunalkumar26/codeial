import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { COMMENT_CREATE_CLEAR } from '../constants/commentConstants';
import { POST_CREATE_CLEAR, POST_FETCH_CLEAR, POST_FETCH_WITH_USER_ID_CLEAR } from '../constants/postConstants';
import { 
    USER_CREATE_CLEAR,
    USER_CREATE_FAIL, 
    USER_CREATE_REQUEST, 
    USER_CREATE_SUCCESS, 
    USER_LIKED_POSTS_FETCH_CLEAR, 
    USER_LIKED_POSTS_FETCH_FAIL, 
    USER_LIKED_POSTS_FETCH_REQUEST, 
    USER_LIKED_POSTS_FETCH_SUCCESS, 
    USER_LOGIN_FAIL, 
    USER_LOGIN_REQUEST, 
    USER_LOGIN_SUCCESS, 
    USER_LOGOUT
} from '../constants/userConstants'

export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({type: USER_LOGIN_REQUEST});
        const data = (await axios.post("/user/login", {email, password})).data.data;
        dispatch({type: USER_LOGIN_SUCCESS, payload:data});
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({type: USER_LOGIN_FAIL, payload:error})
    }
}

export const logOut = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({type: USER_LOGOUT});
    dispatch({type: POST_FETCH_CLEAR})
    dispatch({type: COMMENT_CREATE_CLEAR})
    dispatch({type: POST_CREATE_CLEAR})
    dispatch({type: USER_CREATE_CLEAR})
    dispatch({type: POST_FETCH_WITH_USER_ID_CLEAR})
    dispatch({type: USER_LIKED_POSTS_FETCH_CLEAR})
}

export const createUser = (name, email, password, confirmPassword) => async (dispatch) => {
    try {
        dispatch({type: USER_CREATE_REQUEST});
        let resp = (await axios.post('/user/signup', {name, email, password, confirmPassword})).data;
        console.log("signing up",resp)
        let data = resp.data
        dispatch({type: USER_CREATE_SUCCESS, payload: data});
        dispatch({type: USER_LOGIN_SUCCESS, payload: data});
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({type: USER_CREATE_FAIL, payload: error})
    }
}

export const fetchUserLikedPosts = (uid) => async (dispatch) => {
    try {
        dispatch({type: USER_LIKED_POSTS_FETCH_REQUEST});
        let resp = (await axios.post('/user/likedPostsArr', {uid}));
        let likedPostsArr = resp.data.data;
        dispatch({type: USER_LIKED_POSTS_FETCH_SUCCESS, payload: likedPostsArr});
    } catch (error) {
        dispatch({type: USER_LIKED_POSTS_FETCH_FAIL, payload: error})
    }
}
