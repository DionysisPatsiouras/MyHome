from django.urls import path
from residences import views


urlpatterns = [
    path("", views.list), # GET, POST
    path("<int:id>", views.record), # GET, PATCH, DELETE
    path("types", views.retrieveTypes),
]

