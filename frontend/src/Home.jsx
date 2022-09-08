import { useState, useEffect } from "react"
import Navbar from "./Navbar"

export default function Home() {

    const [spotifyData, setSpotifyData] = useState({});

    useEffect(() => {
        function getCallbackParams() {
            const currentURL = new URLSearchParams(window.location.search);
            const code = currentURL.get('code');
            const error = currentURL.get('error'); //=== null ? '' : currentURL.get('error');

            fetch(`http://127.0.0.1:8000/spotify_callback/?${new URLSearchParams({
                code: code,
                error: error,
            })}`,
                {
                    method: 'POST'
                }
            ).then(async function (response) {
                const res = await response.json();
                console.log(res)
                setSpotifyData(res);
            })
        };

        getCallbackParams();

    }, [])


    return (
        <>
            {
                "status" in spotifyData ?
                    (spotifyData.status === 200 ? <Navbar /> : <h1 className="h-screen w-screen flex justify-center items-center text-6xl">Loading</h1>)
                    :
                    <h1 className="h-screen w-screen flex justify-center items-center text-6xl">Data not found</h1>
            }
        </>
    )
}