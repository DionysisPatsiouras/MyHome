from django.urls import path, include

import os


APPS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'apps')

folders = [
    f for f in os.listdir(APPS_DIR)
    if os.path.isdir(os.path.join(APPS_DIR, f))
    and not f.startswith('_')
    and not f.startswith('.')
]

urlpatterns = [
    path("auth/", include("core.auth.urls")),
    *[path(f"{folder}/", include(f"{folder}.urls")) for folder in folders],
]

