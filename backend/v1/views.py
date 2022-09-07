from contextlib import redirect_stdout
import traceback
import requests
import json
import logging
import os
from django.shortcuts import render, redirect
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from dotenv import dotenv_values
from rest_framework import status

config = dotenv_values(".env")

logger = logging.getLogger(__name__)


@api_view(["GET"])
def login(request):

    login_url = (
        requests.Request(
            "GET",
            "https://accounts.spotify.com/authorize",
            headers={
                "User-Agent": request.META["HTTP_USER_AGENT"],
                "content-type": "application/json",
            },
            params={
                "client_id": config.get("CLIENT_ID"),
                "response_type": config.get("RESPONSE_TYPE"),
                "redirect_uri": config.get("REDIRECT_URI"),
                "scope": config.get("SCOPE"),
            },
        )
        .prepare()
        .url
    )
    return Response({"login_url": login_url}, status=status.HTTP_200_OK)


@api_view(["POST"])
def spotify_callback(request):
    code = request.GET.get("code")
    error = request.GET.get("error")

    if not error or not code or error == "access_denied":
        return Response(
            {"error": "access denied to user"}, status=status.HTTP_401_UNAUTHORIZED
        )

    token_url = requests.post(
        "https://accounts.spotify.com/api/token",
        headers={
            "User-Agent": request.META["HTTP_USER_AGENT"],
        },
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": config.get("REDIRECT_URI"),
            "client_id": config.get("CLIENT_ID"),
            "client_secret": config.get("CLIENT_SECRET"),
        },
    ).json()

    if "error" in token_url.keys():
        return Response(
            {
                "error": "Authorication code expired",
            },
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    access_token = token_url["access_token"]
    token_type = token_url["token_type"]
    expires_in = token_url["expires_in"]
    refresh_token = token_url["refresh_token"]

    user_data = get_user_profile_data(access_token=access_token)
    artists_data = get_top_artists(access_token=access_token)
    tracks_data = get_top_tracks(access_token=access_token)
    followed_artists = get_followed_artists(access_token=access_token)
    users_playlists = get_users_playlists(
        access_token=access_token, user_id=user_data["id"]
    )
    recent_tracks = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/me/player/recently-played?limit=50",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )

    return Response(
        {
            "data": {
                "access_token": access_token,
                "user_data": user_data,
                "artists_data": artists_data,
                "tracks_data": tracks_data,
                "followed_artists": followed_artists,
                "users_playlists": users_playlists,
                "recent_tracks": recent_tracks,
            },
        },
        status=status.HTTP_200_OK,
    )


def logout(request):
    request.session.flush()
    return redirect("login")


# Utility function for user data
def get_user_profile_data(access_token):
    logger.warning(f"Access token in fetching profile data: {access_token}")
    try:
        userProfile = requests.get(
            "https://api.spotify.com/v1/me",
            headers={
                "content-type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer {0}".format(access_token),
            },
        ).text

        userProfile_decoded = json.loads(userProfile)

    except Exception as e:
        logger.error(f"Error in getting user profile data")
        logger.error(userProfile)
        logger.error(traceback.print_exc())

    return userProfile_decoded


# Utility function for artist data
def get_top_artists(access_token, limit=50):
    top_artists_short = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit={limit}",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )
    top_artists_medium = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit={limit}",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )
    top_artists_long = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit={limit}",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )

    return [top_artists_short, top_artists_medium, top_artists_long]


# Utility funtion for track data
def get_top_tracks(access_token, limit=50):
    top_tracks_short = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit={limit}",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )
    top_tracks_medium = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit={limit}",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )
    top_tracks_long = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit={limit}",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )

    return [top_tracks_short, top_tracks_medium, top_tracks_long]


# Utility function to get artists followed by current user
def get_followed_artists(access_token):
    artists = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/me/following?type=artist",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )

    if "error" in artists:
        return "error"

    next_artists_page = artists["artists"]["next"]
    all_artists = artists["artists"]["items"]

    while next_artists_page is not None:
        next_artists = json.loads(
            requests.get(
                next_artists_page,
                headers={
                    "content-type": "application/json",
                    "Authorization": f"Bearer {access_token}",
                },
            ).text
        )

        all_artists += next_artists["artists"]["items"]
        next_artists_page = next_artists["artists"]["next"]

    return (
        {
            "total_artists": len(all_artists),
            "all_artists": all_artists,
        },
    )


# Utility function to get user's playlists
def get_users_playlists(access_token, user_id):
    playlists = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/users/{user_id}/playlists",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )

    if "error" in playlists:
        return "error"

    next_playlist_page = playlists["next"]
    all_playlists = playlists["items"]

    while next_playlist_page is not None:
        next_artists = json.loads(
            requests.get(
                next_playlist_page,
                headers={
                    "content-type": "application/json",
                    "Authorization": f"Bearer {access_token}",
                },
            ).text
        )

        all_playlists += next_artists["items"]
        next_playlist_page = next_artists["next"]

    return all_playlists


# Renders track page
def get_track(request, id):
    access_token = request.session.get("access_token")
    track_data = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/tracks/{id}",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )
    track_features = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/audio-features/{id}",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )
    track_analysis = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/audio-analysis/{id}",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )

    # No genre key in the artists key in the track_data hence can't call
    # the recommendations API

    if "error" in track_data or "error" in track_analysis:
        request.session.flush()
        return redirect("login")

    return render(
        request=request,
        template_name="track_details.html",
        context={
            "track_data": track_data,
            "track_features": track_features,
            "track_analysis": track_analysis,
        },
    )


# Renders artists details page
def get_artist(request, id):
    access_token = request.session.get("access_token")
    artist = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/artists/{id}",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )

    artist_releated_artists = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/artists/{id}/related-artists",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )["artists"]

    # No genre key in the artists key in the track_data hence can't call
    # the recommendations API

    if "error" in artist:
        request.session.flush()
        return redirect("login")

    return render(
        request=request,
        template_name="artist_details.html",
        context={
            "artist": artist,
            "related_artists": artist_releated_artists,
        },
    )


# Renders user followed artists page
def user_followed_artists(request):
    if not request.session.exists(request.session.session_key):
        return redirect("login")

    followed_artists = request.session.get("followed_artists")
    return render(
        request=request,
        template_name="followed_artists.html",
        context={
            "followed_artists": followed_artists,
        },
    )


# Renders album details page
def get_album(request, id):
    access_token = request.session.get("access_token")
    album = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/albums/{id}",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )

    if "error" in album:
        request.session.flush()
        return redirect("login")

    # change the offset and limit - https://api.spotify.com/v1/albums/2ODvWsOgouMbaA5xf0RkJe/tracks?offset=0&limit=50
    next_track_page = album["tracks"]["next"]
    all_tracks = album["tracks"]["items"]

    while next_track_page is not None:
        next_tracks = json.loads(
            requests.get(
                next_track_page,
                headers={
                    "content-type": "application/json",
                    "Authorization": f"Bearer {access_token}",
                },
            ).text
        )

        all_tracks += next_tracks["items"]
        next_track_page = next_tracks["next"]

    return render(
        request=request,
        template_name="album_details.html",
        context={
            "album": album,
            "total_tracks": len(all_tracks),
            "all_tracks": all_tracks,
        },
    )


# Renders playlists page
def all_playlists(request):
    if not request.session.exists(request.session.session_key):
        return redirect("login")

    all_playlists = request.session.get("playlists")
    return render(
        request=request,
        template_name="playlists_page.html",
        context={
            "all_playlists": all_playlists,
        },
    )


# Render individual playlist page
def get_playlist(request, id):
    access_token = request.session.get("access_token")
    playlist = json.loads(
        requests.get(
            f"https://api.spotify.com/v1/playlists/{id}",
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        ).text
    )

    if "error" in playlist:
        request.session.flush()
        return redirect("login")

    # change the offset and limit - https://api.spotify.com/v1/albums/2ODvWsOgouMbaA5xf0RkJe/tracks?offset=0&limit=50
    next_track_page = playlist["tracks"]["next"]
    all_tracks = playlist["tracks"]["items"]

    while next_track_page is not None:
        next_tracks = json.loads(
            requests.get(
                next_track_page,
                headers={
                    "content-type": "application/json",
                    "Authorization": f"Bearer {access_token}",
                },
            ).text
        )

        all_tracks += next_tracks["items"]
        next_track_page = next_tracks["next"]

    return render(
        request=request,
        template_name="playlist_details.html",
        context={
            "playlist": playlist,
            "all_tracks": all_tracks,
        },
    )
