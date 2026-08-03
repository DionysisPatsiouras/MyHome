from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import MyTokenObtainPairView

from . import views

urlpatterns = [
    path("", views.getRoutes),
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("verify-email", views.verifyEmail),
    path("forgot-password", views.forgotPassword),
    path("reset-password", views.resetPassword),
    path("resend-verification", views.resendVerification)
]
