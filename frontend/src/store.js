import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { 
    userLoginReducer,
    userSignupReducer,
    userLikedPostsArrReducer,
    usersOnlineReducer
} from './reducers/userReducers'

import {
    postCreateReducer,
    postsFetchReducer,
    postsFetchWithUserIdReducer
} from './reducers/postReducers'

import {
    commentCreateReducer
} from './reducers/commentReducers'

import {
    notificationsFetchReducer,
} from './reducers/notificationReducers'

const reducer = combineReducers({
    // this will contain all our reducers
    userLoginReducer,
    userSignupReducer,
    postCreateReducer,
    postsFetchReducer,
    commentCreateReducer,
    postsFetchWithUserIdReducer,
    userLikedPostsArrReducer,
    notificationsFetchReducer,
    usersOnlineReducer
})

let userInfo = localStorage.getItem('userInfo')
if(userInfo && userInfo != "undefined") {
    userInfo = JSON.parse(localStorage.getItem('userInfo'))
} else {
    userInfo = null;
}

let initialState = userInfo ? 
{
    "userLoginReducer": {
        "userInfo": userInfo
    }
} : 
{
    "userLoginReducer": {}
}

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store