export default function Navbar() {


    return (

        <nav
            className="fixed left-0 bottom-0 md:top-0 w-screen md:w-24 md:h-full bg-black flex flex-row md:flex-col justify-between md:px-0 md:py-4">

            <div className="hidden md:flex flex-col items-center mt-4">
                <a href="#">
                    <img src="" className="w-12 h-12" alt="Logo" />
                </a>
            </div>

            <div className="flex flex-row w-full justify-between md:flex-col items-center">

                <div
                    className="w-full py-4 transition duration-300 ease-in-out cursor-pointer border-t-4 md:border-l-4 md:border-t-0 border-green-500 bg-green-800/30 text-white">
                    <a href="#" className="flex flex-col items-center justify-center">
                        <span className="iconify w-6 h-6" data-icon="bxs:user" data-width="40" data-height="40"></span>
                        <p className="text-xs mt-1">Profile</p>
                    </a>
                </div>

                <div
                    className="w-full py-4 transition duration-300 ease-in-out cursor-pointer border-t-4 md:border-l-4 md:border-t-0 border-black hover:border-green-500 hover:bg-green-800/30 text-zinc-400 hover:text-white">
                    <a href="#" className="flex flex-col items-center justify-center">
                        <span className="iconify w-6 h-6" data-icon="entypo:modern-mic" data-width="40" data-height="40"></span>
                        <p className="text-xs mt-1">Top Artists</p>
                    </a>
                </div>
                <div
                    className="w-full py-4 transition duration-300 ease-in-out cursor-pointer border-t-4 md:border-l-4 md:border-t-0 border-green-500 bg-green-800/30 text-white">
                    <a href="#" className="flex flex-col items-center justify-center">
                        <span className="iconify w-6 h-6" data-icon="fluent:music-note-2-16-filled" data-width="40"
                            data-height="40"></span>
                        <p className="text-xs mt-1">Top Tracks</p>
                    </a>
                </div>

                <div
                    className="w-full py-4 transition duration-300 ease-in-out cursor-pointer border-t-4 md:border-l-4 md:border-t-0 border-black hover:border-green-500 hover:bg-green-800/30 text-zinc-400 hover:text-white">
                    <a href="#" className="flex flex-col items-center justify-center">
                        <span className="iconify w-6 h-6" data-icon="carbon:recently-viewed" data-width="40"
                            data-height="40"></span>
                        <p className="text-xs mt-1">Recent</p>
                    </a>
                </div>

                <div
                    className="w-full py-4 transition duration-300 ease-in-out cursor-pointer border-t-4 md:border-l-4 md:border-t-0 border-green-500 bg-green-800/30 text-white">
                    <a href="#" className="flex flex-col items-center justify-center">
                        <span className="iconify w-6 h-6" data-icon="mdi:playlist-music" data-width="40" data-height="40"></span>
                        <p className="text-xs mt-1">Playlists</p>
                    </a>
                </div>
            </div>

            <div className="hidden md:flex flex-col items-center mb-4">
                <a href="#">
                    <span className="iconify w-8 h-8 text-zinc-400 hover:text-white" data-icon="akar-icons:github-fill"
                        data-width="40" data-height="40"></span>
                </a>
            </div>

        </nav>
    );
}