from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ALUNO = "ALUNO", "Aluno"
        PROFESSOR = "PROFESSOR", "Professor"
        STAFF = "STAFF", "Staff"
        SUPERUSER = "SUPERUSER", "Superuser"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.ALUNO)
    phone = models.CharField(max_length=20, blank=True, null=True)
    document_id = models.CharField(max_length=32, blank=True, null=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    timezone = models.CharField(max_length=64, default="America/Sao_Paulo")
    preferences = models.JSONField(default=dict, blank=True)