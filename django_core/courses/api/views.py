from rest_framework import generics, permissions
from courses.models import ClassSession
from .serializers import ClassSessionSerializer
from django.utils import timezone

class ProfessorScheduleView(generics.ListAPIView):
    serializer_class = ClassSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Filter classes for the logged-in professor, from today onwards
        return ClassSession.objects.filter(
            professor=user,
            start_time__gte=timezone.now()
        ).order_by('start_time')
