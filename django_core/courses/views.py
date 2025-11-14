from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from .models import Course
from .serializers import CourseSerializer


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description", "level"]