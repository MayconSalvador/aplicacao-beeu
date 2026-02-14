from rest_framework import serializers
from courses.models import ClassSession

class ClassSessionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    plan_name = serializers.CharField(source='student.plan.name', read_only=True, allow_null=True)
    
    class Meta:
        model = ClassSession
        fields = ['id', 'student_name', 'plan_name', 'start_time', 'end_time', 'meet_link']
