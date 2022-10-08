import axios from "axios"
import {
    NOTIFICATIONS_FETCH_REQUEST,
    NOTIFICATIONS_FETCH_SUCCESS,
    NOTIFICATIONS_FETCH_FAIL,
} from '../constants/notificationConstants'

export const fetchNotifications = (uid) => async (dispatch) => {
    try {
        dispatch({type: NOTIFICATIONS_FETCH_REQUEST});
        let resp = await axios.post('/user/notifications', {uid});
        if(resp.data.data) {
            dispatch({type: NOTIFICATIONS_FETCH_SUCCESS, payload: resp.data.data});
        }
    } catch (error) {
        dispatch({type: NOTIFICATIONS_FETCH_FAIL, payload: error})
    }
}