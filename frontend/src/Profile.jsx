
export default function Profile(props) {
    return (


        // < !--Content section(Copy this for all pages) -->
        <main class="font-sans mt-8 md:mt-20 mb-4 md:mb-20 w-full md:max-w-5xl md:mx-auto px-10" x-show="openTab === 'profile'">

            {/* <!-- Header section --> */}
            <div class="flex flex-col justify-center items-center">

                {/* <!-- Profile image --> */}
                <img src="{{user_data.images.0.url}}" alt="profile image" class="rounded-full h-36 w-36 object-cover">

                    {/* <!-- User display name --> */}
                    <a href="{{user_data.external_urls.spotify}}" class="mt-8">
                        <h1 class="text-3xl md:text-5xl font-semibold hover:text-green-500 transition duration-300 ease-in-out">
                            {{ user_data.display_name }}
                        </h1>
                    </a>
                    <h3 class="text-sm text-gray-500 tracking-wider font-light">{{ user_data.product | upper }}</h3>

                    {/* <!-- Profile Metrics --> */}
                    <div class="flex flex-row items-center gap-4 mt-6">

                        {/* <!-- Followers --> */}
                        <div class="flex flex-col justify-center items-center">
                            <h1 class="text-lg font-semibold text-green-500">{{ user_data.followers.total }}</h1>
                            <span
                                class="text-xs font-light text-gray-400">FOLLOWER{{ user_data.followers.total | pluralize | upper }}</span>
                        </div>

                        {/* <!-- Followed --> */}
                        <a href="{% url 'followed_artists' %}" class="flex flex-col justify-center items-center">
                            <h1 class="text-lg font-semibold text-green-500">{{ followed_artists| length}}</h1>
                            <span class="text-xs font-light text-gray-400">FOLLOWING</span>
                        </a>

                        {/* <!-- Playlists --> */}
                        <a href="{% url 'all_playlists' %}" class="flex flex-col justify-center items-center">
                            <h1 class="text-lg font-semibold text-green-500">{{ playlists| length}}</h1>
                            <span class="text-xs font-light text-gray-400">PLAYLIST{{ playlists| length | pluralize | upper}}</span>
                        </a>
                    </div>

                    {/* <!-- Logout --> */}
                    <a href="{% url 'logout' %}"
                        class="mt-8 py-2 px-10 border border-gray-200 text-sm rounded-full font-normal tracking-wider hover:bg-gray-200 hover:text-black transition duration-300 ease-in-out">LOGOUT</a>
            </div>

            {/* <!-- Spotify data --> */}
            <div class="mt-20 grid grid-cols-1 md:grid-cols-2 justify-between gap-12">

                {/* <!-- Artists Section --> */}
                <div class="flex flex-col gap-8">

                    {/* <!-- Heading --> */}
                    <div class="flex flex-row justify-between items-center">
                        <h1 class="font-bold text-md md:text-xl">Top Artists of All Time</h1>
                        <a href="{% url 'top_artists' %}"
                            class="py-2 px-4 border border-gray-200 text-sm rounded-full font-normal tracking-wider hover:bg-gray-200 hover:text-black transition duration-300 ease-in-out">SEE
                            MORE</a>
                    </div>

                    {/* <!-- artists --> */}
                    <div class="flex flex-col gap-10">
                        {% for artist in artists_data %}
                        <a href="{% url 'get_artist' artist.id %}">
                            <div class="flex flex-row items-center gap-4">
                                <img src="{{artist.images.0.url}}" alt="artist image"
                                    class="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover">
                                    <h1 class="font-light">{{ artist.name }}</h1>
                            </div>
                        </a>
                        {% endfor %}
                    </div>
                </div>

                {/* <!-- Tracks Section --> */}
                <div class="flex flex-col gap-8">

                    {/* <!-- Heading --> */}
                    <div class="flex flex-row justify-between items-center">
                        <h1 class="font-bold text-md md:text-xl">Top Tracks of All Time</h1>
                        <a href="{% url 'top_tracks' %}"
                            class="py-2 px-4 border border-gray-200 text-sm rounded-full font-normal tracking-wider hover:bg-gray-200 hover:text-black transition duration-300 ease-in-out">SEE
                            MORE</a>
                    </div>

                    {/* <!-- Tracks --> */}
                    <div class="flex flex-col gap-10">
                        {% for track in track_data %}
                        <a href="{% url 'get_track' track.id %}">
                            <div class="flex flex-row justify-between items-center">
                                <div class="flex flex-row items-center gap-4">
                                    <img src="{{track.album.images.0.url}}" alt="artist image"
                                        class="h-12 w-12 md:h-14 md:w-14 object-cover">
                                        <div class="flex flex-col items-start justify-center truncate overflow-hidden">
                                            <h1 class="font-light">{{ track.name }}</h1>
                                            <div class="flex flex-row justify-between items-center gap-2">
                                                <p class="text-xs text-gray-400 font-light text-ellipsis overflow-hidden">
                                                    {{ track.artists | get_track_all_artists }}
                                                </p>
                                                <div class="bg-gray-400 w-1 h-1 rounded-full"></div>
                                                <p class="text-xs text-gray-400 font-light">{{ track.album.name }}</p>
                                            </div>
                                        </div>
                                </div>

                                {/* <!-- Track duration --> */}
                                <p class="text-xs text-gray-400">{{ track.duration_ms | ms_to_m_s }}</p>
                            </div>
                        </a>
                        {% endfor %}
                    </div>

                </div>
            </div>

        </main>
    )
}