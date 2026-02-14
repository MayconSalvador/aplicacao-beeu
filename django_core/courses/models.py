from django.db import models
from django.conf import settings


class Plan(models.Model):
    name = models.CharField(max_length=200, verbose_name="Nome do Curso/Plano")
    description = models.TextField(blank=True, verbose_name="Descrição")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Plano"
        verbose_name_plural = "Planos"


class Course(models.Model):
    LEVELS = [
        ("A1", "A1"), ("A2", "A2"), ("B1", "B1"), ("B2", "B2"), ("C1", "C1"), ("C2", "C2"),
    ]
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    level = models.CharField(max_length=2, choices=LEVELS)
    price_br = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    syllabus = models.JSONField(default=dict, blank=True)
    thumbnail = models.URLField(blank=True, null=True)
    duration_months = models.PositiveSmallIntegerField(choices=[(6, "6 meses"), (12, "12 meses")], default=6)

    def __str__(self):
        return self.title


class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="modules")
    order = models.PositiveIntegerField(default=1)
    title = models.CharField(max_length=200)
    summary = models.TextField(blank=True)


class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="lessons")
    order = models.PositiveIntegerField(default=1)
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)


class Material(models.Model):
    class Type(models.TextChoices):
        LINK = "LINK", "Link"
        FILE = "FILE", "Arquivo"

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="materials", null=True, blank=True)
    type = models.CharField(max_length=10, choices=Type.choices)
    url = models.URLField(blank=True, null=True)
    file = models.CharField(max_length=255, blank=True, null=True)  # placeholder para S3 key
    description = models.CharField(max_length=255, blank=True)
    visible = models.BooleanField(default=True)


class ClassSession(models.Model):
    professor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="classes_taught",
        limit_choices_to={"role": "PROFESSOR"},
        verbose_name="Professor"
    )
    student = models.ForeignKey(
        "users.Student",
        on_delete=models.CASCADE,
        related_name="classes_attended",
        verbose_name="Aluno"
    )
    start_time = models.DateTimeField(verbose_name="Início")
    end_time = models.DateTimeField(verbose_name="Fim")
    google_event_id = models.CharField(max_length=255, blank=True, null=True, verbose_name="ID Google Calendar")
    meet_link = models.URLField(blank=True, null=True, verbose_name="Link da Aula (Meet)")

    def __str__(self):
        return f"{self.professor} - {self.student} ({self.start_time})"

    class Meta:
        verbose_name = "Aula"
        verbose_name_plural = "Aulas"
        ordering = ["-start_time"]
