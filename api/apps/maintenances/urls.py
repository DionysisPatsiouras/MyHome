
from django.urls import path
import importlib

# import views.py from current file
app_name = __name__.split('.')[0]
views = importlib.import_module(f"{app_name}.views")


urlpatterns = [
    path("", views.list), # GET, POST
    path("<int:id>", views.record), # GET, PATCH, DELETE

    path("history/", views.history_list), # GET, POST
    path("history/<int:id>", views.history_record), # GET, PATCH, DELETE
 

    path("overview/<int:id>", views.overview)
]
