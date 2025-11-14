from rest_framework import serializers
from .models import Enrollment
from courses.serializers import CourseSerializer


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ["id", "status", "start_date", "end_date", "progress", "notes", "course"]