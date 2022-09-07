import { useState, useEffect } from "react";

export default function Login() {
    const djangoLogin = 'http://127.0.0.1:8000/login/';

    const [loginURL, setLoginURL] = useState('#');

    useEffect(() => {

        async function fetchData() {
            const response = await fetch(djangoLogin);
            const res = await response.json();
            setLoginURL(res["login_url"]);
        }

        fetchData();

    }, [])

    const setLoggedIn = () => localStorage.setItem('isLoggedIn', true);

    return (
        <div className="h-screen w-screen flex justify-center items-center bg-zinc-800" >
            <a href={loginURL} onClick={setLoggedIn} className="py-4 px-6 bg-green-500 rounded-full font-semibold md:bg-green-600 md:hover:bg-green-500 transition duration-300 ease-in-out">
                Log in with Spotify
            </a>
        </div >
    )
}