from django.db import models
from courses.models import Course


class ContentItem(models.Model):
    class Type(models.TextChoices):
        VIDEO = "VIDEO", "Vídeo"
        TEXTO = "TEXTO", "Texto"
        LINK = "LINK", "Link"

    class Audience(models.TextChoices):
        ALL = "ALL", "Todos"
        ALUNO = "ALUNO", "Aluno"
        PROFESSOR = "PROFESSOR", "Professor"

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=10, choices=Type.choices)
    url = models.URLField()
    is_active = models.BooleanField(default=True)
    published_at = models.DateTimeField(null=True, blank=True)
    audience = models.CharField(max_length=16, choices=Audience.choices, default=Audience.ALL)
    # Curso ao qual este conteúdo pertence (opcional). Se definido, o acesso exigirá matrícula nesse curso.
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="contents")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title