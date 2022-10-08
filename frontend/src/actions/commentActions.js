import axios from "axios";
import {
    COMMENT_CREATE_FAIL,
    COMMENT_CREATE_REQUEST,
    COMMENT_CREATE_SUCCESS
} from "../constants/commentConstants";


export const createComment = (comment, user, postId) => async (dispatch) => {
    try {
        dispatch({type: COMMENT_CREATE_REQUEST});
        let data = await axios.post('/user/comment', {comment, user, postId});
        dispatch({type: COMMENT_CREATE_SUCCESS, payload: data});
    } catch (error) {
        dispatch({type: COMMENT_CREATE_FAIL, payload: error})
    }
}