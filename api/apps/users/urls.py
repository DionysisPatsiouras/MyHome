

from django.urls import path
import importlib

# import views.py from current file
app_name = __name__.split('.')[0]
views = importlib.import_module(f"{app_name}.views")

urlpatterns = [
    path("me", views.me),  # GET, PATCH
    path("change-password", views.changePassword), # POST
    path("", views.insert) # POST
]