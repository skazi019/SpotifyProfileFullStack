import { useState, useEffect } from "react"
import Navbar from "./Navbar"

export default function Home() {

    const [spotifyData, setSpotifyData] = useState({});

    useEffect(() => {
        async function getCallbackParams() {
            const currentURL = await new URLSearchParams(window.location.search);

            fetch('http://127.0.0.1:8000/spotify_callback/', {
                params: {
                    'code': currentURL.get('code'),
                    'error': currentURL.get('error'),
                }
            }).then(function (response) {
                console.log(response);
                setSpotifyData(response);
            })
        };

        getCallbackParams();

    }, [])


    return (
        <>
            {spotifyData ? <Navbar /> : <h1>Data not found</h1>
            }
        </>
    )
}