import { useState, useEffect } from "react"
import Home from "./Home";
import Loader from "./Loader";

export default function Transition() {

    const [spotifyData, setSpotifyData] = useState({});
    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError] = useState(false);

    useEffect(() => {
        function getCallbackParams() {
            const currentURL = new URLSearchParams(window.location.search);
            const code = currentURL.get('code');
            const error = currentURL.get('error');

            fetch(`http://127.0.0.1:8000/spotify_callback/?${new URLSearchParams({
                code: code,
                error: error,
            })}`,
                {
                    method: 'POST'
                }
            ).then(async function (response) {
                const res = response;
                (res.status === 200) ? setDataLoading(false) : setDataError(true);
                const data = await res.json()
                !("data" in data) ? setDataError(true) : setDataError(false);
                setSpotifyData(data["data"]);
            })
        };

        getCallbackParams();

    }, [])


    return (
        <>
            {
                !dataError ?
                    (dataLoading ? <Loader /> :
                        <Home
                            access_token={spotifyData["access_token"]}
                            artists_data={spotifyData["artists_data"]}
                            tracks_data={spotifyData["tracks_data"]}
                            user_data={spotifyData["user_data"]}
                            recent_tracks={spotifyData["recent_tracks"]}
                            users_playlists={spotifyData["users_playlists"]}
                            followed_artists={spotifyData["followed_artists"]}
                        />)
                    : (<div className="h-screen w-screen flex flex-col justify-center items-center">
                        <h1 className="text-6xl">Error in fetching data</h1>
                    </div>)

            }
        </>
    )
}