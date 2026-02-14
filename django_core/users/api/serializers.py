from rest_framework import serializers
from users.models import Student
from courses.models import Plan

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'name']

class StudentSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)
    
    class Meta:
        model = Student
        fields = ['id', 'name', 'email', 'plan', 'phone']
