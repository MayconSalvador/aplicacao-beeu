from django.db import models


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