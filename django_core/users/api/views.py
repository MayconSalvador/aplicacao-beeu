from rest_framework import generics, permissions
from users.models import Student
from .serializers import StudentSerializer

class StudentListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Could filter by professor if needed, but for now lists all active students
        return Student.objects.all()
