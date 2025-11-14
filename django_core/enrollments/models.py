from django.db import models
from django.utils import timezone
from users.models import User
from courses.models import Course, Lesson


class Enrollment(models.Model):
    class Status(models.TextChoices):
        ATIVA = "ATIVA", "Ativa"
        CONCLUIDA = "CONCLUIDA", "Concluída"
        TRANCADA = "TRANCADA", "Trancada"
        CANCELADA = "CANCELADA", "Cancelada"

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ATIVA)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)
    progress = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)


class Attendance(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name="attendances")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    present = models.BooleanField(default=False)
    timestamp = models.DateTimeField(default=timezone.now)


class Grade(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name="grades")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    score = models.FloatField(default=0)
    feedback = models.TextField(blank=True)