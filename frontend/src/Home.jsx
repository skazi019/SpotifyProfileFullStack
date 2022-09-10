import Navbar from "./Navbar"
import Profile from "./Profile";

export default function Home(props) {
    return (
        <>
            <Navbar />
            <Profile access_token={props.access_token} />
        </>
    );
}