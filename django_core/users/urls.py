from django.urls import path
from .views import me, change_password
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .api.views import StudentListView

urlpatterns = [
    path("me", me),
    path("change-password", change_password),
    path("login", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh", TokenRefreshView.as_view(), name="token_refresh"),
    # path("register", register), # Removed public registration
    path("students", StudentListView.as_view(), name="student-list"),
]
