import { POST_CREATE_CLEAR, POST_CREATE_FAIL, POST_CREATE_REQUEST, POST_CREATE_SUCCESS, POST_FETCH_CLEAR, POST_FETCH_FAIL, POST_FETCH_REQUEST, POST_FETCH_SUCCESS, POST_FETCH_WITH_USER_ID_CLEAR, POST_FETCH_WITH_USER_ID_FAIL, POST_FETCH_WITH_USER_ID_REQUEST, POST_FETCH_WITH_USER_ID_SUCCESS } from "../constants/postConstants";


export const postCreateReducer = (state={}, action) => {
    switch (action.type) {
        case POST_CREATE_REQUEST:
            return {loading: true}
        case POST_CREATE_SUCCESS:
            if(!state.posts){
                state.posts = [];
            }
            return {...state, loading: false, posts: state.posts.push(action.payload)}
        case POST_CREATE_FAIL:
            return {...state, loading: false, error: action.payload}
        case POST_CREATE_CLEAR:
            return {}
        default:
            return state;
    }
}

export const postsFetchReducer = (state={}, action) => {
    switch (action.type) {
        case POST_FETCH_REQUEST:
            return {loading: true}
        case POST_FETCH_SUCCESS:
            return {loading: false, postsArr: action.payload}
        case POST_FETCH_FAIL:
            return {loading: false, error: action.payload}
        case POST_FETCH_CLEAR:
            return {}
        default:
            return state;
    }
}

export const postsFetchWithUserIdReducer = (state={}, action) => {
    switch (action.type) {
        case POST_FETCH_WITH_USER_ID_REQUEST:
            return {loading: true}
        case POST_FETCH_WITH_USER_ID_SUCCESS:
            return {loading: false, postsArrWithUserId: action.payload}
        case POST_FETCH_WITH_USER_ID_FAIL:
            return {loading: false, error: action.payload}
        case POST_FETCH_WITH_USER_ID_CLEAR:
            return {}
        default:
            return state
    }
}