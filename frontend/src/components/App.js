import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './Home'
import Wall from './Wall'
import Profile from './Profile'
import Navbar from './Navbar'
import CreatePost from './CreatePost'
import OtherProfile from './OtherProfile'
import PageNotFound from './PageNotFound'
import { fetchPosts } from '../actions/postActions';
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserLikedPosts } from '../actions/userActions'
import SinglePost from './SinglePost'

function App() {
  // console.log("App rendered")
  let {userInfo} = useSelector((state) => state.userLoginReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    // console.log("here", userInfo);
    if (userInfo) {
      dispatch(fetchPosts())
      dispatch(fetchUserLikedPosts(userInfo._id));
    }
  }, [userInfo])

  return (
    <div className='overflow-auto h-screen bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400'>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home></Home>}>
        </Route>
        <Route path="/profile" element={<Profile></Profile>}>
        </Route>
        <Route path="/wall" element={<Wall></Wall>}>
        </Route>
        <Route path="/post" element={<CreatePost></CreatePost>}>
        </Route>
        <Route path="/post/:postId" element={<SinglePost></SinglePost>}>
        </Route>
        <Route path="/otherProfile/:userId" element={<OtherProfile></OtherProfile>}>
        </Route>
        <Route path="*" element={<PageNotFound></PageNotFound>}>
        </Route>
      </Routes>
    </div>
  )
}

export default App