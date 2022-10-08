import {
    COMMENT_CREATE_CLEAR,
    COMMENT_CREATE_FAIL,
    COMMENT_CREATE_REQUEST,
    COMMENT_CREATE_SUCCESS
} from "../constants/commentConstants"


export const commentCreateReducer = (state={}, action) => {
    switch (action.type) {
        case COMMENT_CREATE_REQUEST:
            return {loading: true}
        case COMMENT_CREATE_SUCCESS:
            if(!state.comments){
                state.comments = []
            }
            return {...state, loading: false, comments: state.comments.push(action.payload)}
        case COMMENT_CREATE_FAIL:
            return {loading: false, error: action.payload}
        case COMMENT_CREATE_CLEAR:
            return {}
        default:
            return {}
    }
}