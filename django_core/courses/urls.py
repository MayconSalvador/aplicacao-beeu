from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, PlanViewSet
from .api.views import ProfessorScheduleView

router = DefaultRouter()
router.register(r"plans", PlanViewSet, basename="plan")
router.register(r"", CourseViewSet, basename="course")

urlpatterns = [
    path("schedule/", ProfessorScheduleView.as_view(), name="professor-schedule"),
] + router.urls
