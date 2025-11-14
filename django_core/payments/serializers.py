from rest_framework import serializers
from .models import Order
from courses.models import Course
from courses.serializers import CourseSerializer


class OrderSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    course_slug = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "student",
            "course",
            "course_slug",
            "amount",
            "currency",
            "status",
            "provider",
            "provider_ref",
            "created_at",
        ]
        read_only_fields = ["id", "student", "course", "amount", "currency", "status", "provider_ref", "created_at"]

    def create(self, validated_data):
        slug = validated_data.pop("course_slug")
        course = Course.objects.get(slug=slug)
        # amount e currency derivados do curso
        order = Order.objects.create(
            student=validated_data.get("student"),
            course=course,
            amount=course.price_br,
            currency="BRL",
            status=Order.Status.CRIADA,
            provider=validated_data.get("provider", Order.Provider.MERCADO_PAGO),
        )
        return order