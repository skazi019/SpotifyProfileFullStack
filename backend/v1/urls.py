from django.urls import path
from .views import login, spotify_callback

urlpatterns = [
    path("login/", login),
    path("spotify_callback/", spotify_callback),
]
