import React from 'react';
import {useNavigate} from 'react-router-dom'

function PageNotFound() {
    // console.log("PageNotFound rendered")
    const navigate = useNavigate();
    const redirectHome = () => {
        navigate('/');
    }
    return (
        <div className="text-white text-center py-48 mt-28">
            <div className="text-5xl">
                404 - PageNotFound :(
            </div>
            <div >
                <button onClick={redirectHome} className="text-3xl my-6 bg-white-500 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                    Home
                </button>
            </div>
        </div>
    )
}

export default PageNotFound;