import { useState, useEffect } from "react"
import Navbar from "./Navbar"

export default function Home() {

    const [spotifyData, setSpotifyData] = useState({});
    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError] = useState(false);

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
                const res = await response;
                (res.status === 200) ? setDataLoading(false) : setDataError(true);
                console.log(`Data Status: ${dataLoading}`)
                const data = await res.json()
                !("data" in data) ? setDataError(true) : setDataError(false);
                console.log(data)
                setSpotifyData(data);
            })
        };

        getCallbackParams();

    }, [])


    return (
        <>
            {
                !dataError ?
                    (dataLoading ? <h1 className="h-screen w-screen flex justify-center items-center text-6xl">Loading</h1> : <Navbar />)
                    : (<div className="h-screen w-screen flex flex-col justify-center items-center">
                        <h1 className="text-6xl">Error in fetching data</h1>
                        <p className="text-3xl">{spotifyData.error}</p>
                    </div>)

            }
        </>
    )
}