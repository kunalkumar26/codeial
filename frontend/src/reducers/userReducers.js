import { 
    USER_CREATE_CLEAR, 
    USER_CREATE_FAIL, 
    USER_CREATE_REQUEST, 
    USER_CREATE_SUCCESS, 
    USER_LIKED_POSTS_FETCH_CLEAR, 
    USER_LIKED_POSTS_FETCH_DEC, 
    USER_LIKED_POSTS_FETCH_FAIL, 
    USER_LIKED_POSTS_FETCH_INC, 
    USER_LIKED_POSTS_FETCH_REQUEST, 
    USER_LIKED_POSTS_FETCH_SUCCESS, 
    USER_LOGIN_FAIL, 
    USER_LOGIN_REQUEST, 
    USER_LOGIN_SUCCESS, 
    USER_LOGIN_UPDATE, 
    USER_LOGOUT, 
    USER_UPDATE_CLEAR, 
    USER_UPDATE_FAIL, 
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USERS_ONLINE_UPDATE,
    USERS_ONLINE_CLEAR
} from '../constants/userConstants'

export const userLoginReducer = (state={}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return {loading: true};
        case USER_LOGIN_SUCCESS:
            return {loading: false, userInfo: action.payload};
        case USER_LOGIN_FAIL:
            return {loading: false, error: action.payload};
        case USER_LOGIN_UPDATE:
            console.log("updating user",action.payload);
            return {...state, loading: false, userInfo: action.payload};
        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
}

export const userSignupReducer = (state={}, action) => {
    switch (action.type) {
        case USER_CREATE_REQUEST:
            return {loading: true}
        case USER_CREATE_SUCCESS:
            return {loading:false, userInfo: action.payload}
        case USER_CREATE_FAIL:
            return {loading: false, error: action.payload}
        case USER_CREATE_CLEAR:
            return {}
        default:
            return state;
    }
}

export const userLikedPostsArrReducer = (state={}, action) => {
    let arr;
    switch (action.type) {
        case USER_LIKED_POSTS_FETCH_REQUEST:
            return {loading: true}
        case USER_LIKED_POSTS_FETCH_SUCCESS:
            return {loading: false, userLikedPostsArr: action.payload}
        case USER_LIKED_POSTS_FETCH_FAIL:
            return {loading:false, error: action.payload}
        case USER_LIKED_POSTS_FETCH_CLEAR:
            return {}
        case USER_LIKED_POSTS_FETCH_INC:
            arr = [...state.userLikedPostsArr]
            arr.push(action.payload)
            return {loading:false, userLikedPostsArr: arr}
        case USER_LIKED_POSTS_FETCH_DEC:
            arr = [...state.userLikedPostsArr]
            let ind = arr.indexOf(action.payload);
            arr.splice(ind, 1)
            return {loading:false, userLikedPostsArr: arr}
        default:
            return state;
    }
}

export const usersOnlineReducer = (state={}, action) => {
    switch (action.type) {
        case USERS_ONLINE_UPDATE:
            console.log("eqwerqwerqewr")
            return {onlineUsers: action.payload}
        case USERS_ONLINE_CLEAR:
            return {}
        default:
            return state;
    }
}