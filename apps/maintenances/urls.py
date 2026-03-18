
from django.urls import path
from maintenances import views


urlpatterns = [
    path("", views.list), # GET, POST
    path("<int:id>", views.record), # GET, PATCH, DELETE

    path("history/", views.history_list), # GET, POST
    path("history/<int:id>", views.history_record), # GET, PATCH, DELETE
 

    path("overview/<int:id>", views.overview)
]
