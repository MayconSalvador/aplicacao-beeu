from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from .validators import validate_cpf, validate_phone

class User(AbstractUser):
    class Role(models.TextChoices):
        # ALUNO removed as students are now in a separate table and do not login
        PROFESSOR = "PROFESSOR", "Professor"
        STAFF = "STAFF", "Staff"
        SUPERUSER = "SUPERUSER", "Superuser"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.PROFESSOR)
    phone = models.CharField(max_length=20, blank=True, null=True)
    document_id = models.CharField(max_length=32, blank=True, null=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

class ProfessorManager(UserManager):
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(role=User.Role.PROFESSOR)

class Professor(User):
    objects = ProfessorManager()
    
    class Meta:
        proxy = True
        verbose_name = "Professor"
        verbose_name_plural = "Professores"

class Student(models.Model):
    name = models.CharField(max_length=255, verbose_name="Nome Completo")
    email = models.EmailField(unique=True, verbose_name="Email")
    document_id = models.CharField(
        max_length=14, 
        unique=True, 
        verbose_name="CPF", 
        validators=[validate_cpf]
    )
    phone = models.CharField(
        max_length=20, 
        blank=True, 
        null=True, 
        verbose_name="Telefone (com DDD)",
        validators=[validate_phone]
    )
    
    plan = models.ForeignKey(
        "courses.Plan",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="students",
        verbose_name="Plano Cadastrado"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "User's"
        verbose_name_plural = "User's"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    timezone = models.CharField(max_length=64, default="America/Sao_Paulo")
    preferences = models.JSONField(default=dict, blank=True)
