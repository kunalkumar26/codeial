import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

const { loginUser } = require('../actions/userActions')

function Login() {
    // console.log("Login rendered")

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    const dispatch = useDispatch();
    let { loading, error } = useSelector((state) => state.userLoginReducer);
    let userInfo = useSelector((state) => state.userLoginReducer.userInfo);

    const loginHandler = async (e) => {
        e.preventDefault();
        dispatch(loginUser(email, password));
    }

    if(loading){
        return (
            <div>
                Loading...
            </div>
        )
    } else if(error) {
        return (
            <div>
                {error}
            </div>
        )
    } else if (userInfo) {
        console.log("here")
        return (
            <Navigate to="/profile"></Navigate>
        )
    }
    
    return (
        <div>
            <div className="w-full max-w-xs">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="abc@gmail.com" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="*****" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button onClick={loginHandler} className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                            Log In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;