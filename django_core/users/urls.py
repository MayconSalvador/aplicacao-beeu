from django.urls import path
from .views import me, register, change_password
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("me", me),
    path("change-password", change_password),
    path("login", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("register", register),
]