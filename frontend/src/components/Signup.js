import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from '../actions/userActions'
import { Navigate } from "react-router-dom";

function Signup() {
    // console.log("Signup rendered")
    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [confirmPassword, setConfirmPassword] = useState("");

    let dispatch = useDispatch();

    let {loading, error, userInfo} = useSelector((state) => state.userSignupReducer);

    const createUserHandler = (e) => {
        e.preventDefault();
        dispatch(createUser(name, email, password, confirmPassword));
    }

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    } else if (error) {
        return (
            <div>
                {error}
            </div>
        )
    } else if (userInfo) {
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
                            Name
                        </label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="John..." />
                    </div>
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
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm Password
                        </label>
                        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="confirmPassword" type="password" placeholder="*****" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button onClick={createUserHandler} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup;