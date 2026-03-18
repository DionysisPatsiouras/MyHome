from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import MyTokenObtainPairView

from . import views

urlpatterns = [
    # path("api/token/", TokenObtainPairView.as_view()),
    # path("api/token/refresh/", TokenRefreshView.as_view()),
    path('', views.getRoutes),
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
