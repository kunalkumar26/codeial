import { 
    NOTIFICATIONS_FETCH_CLEAR, 
    NOTIFICATIONS_FETCH_FAIL, 
    NOTIFICATIONS_FETCH_REQUEST, 
    NOTIFICATIONS_FETCH_SUCCESS 
} from "../constants/notificationConstants"


export const notificationsFetchReducer = (state={}, action) => {
    switch (action.type) {
        case NOTIFICATIONS_FETCH_REQUEST:
            return {loading: true}
        case NOTIFICATIONS_FETCH_SUCCESS:
            return {loading:false, notificationObj: action.payload}
        case NOTIFICATIONS_FETCH_FAIL:
            return {loading:false, error: action.payload}
        case NOTIFICATIONS_FETCH_CLEAR:
            return {}
        default:
            return state;
    }
}