
from django.urls import path
from tenants import views

urlpatterns = [
    path("", views.list), # GET, POST
    path("<int:id>", views.record), # GET, PATCH, DELETE
]
