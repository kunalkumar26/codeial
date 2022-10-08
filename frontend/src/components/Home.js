import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Signup from './Signup'
import Login from './Login'

function Home() {
    // console.log("Home rendered")
    let {userInfo} = useSelector((state) => state.userLoginReducer);
    if(userInfo){
        return (
            <Navigate to="/profile"></Navigate>
        )
    } else {
        return (
            <div className='flex flex-row justify-center justify-around items-center my-28 '>
                <Signup></Signup>
                <Login></Login>
            </div>
        )
    }
    
}

export default Home;