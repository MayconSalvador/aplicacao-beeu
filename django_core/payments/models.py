from django.db import models
from django.utils import timezone
from users.models import User
from courses.models import Course


class Order(models.Model):
    class Status(models.TextChoices):
        CRIADA = "CRIADA", "Criada"
        PAGA = "PAGA", "Paga"
        FALHOU = "FALHOU", "Falhou"
        ESTORNADA = "ESTORNADA", "Estornada"
        CANCELADA = "CANCELADA", "Cancelada"

    class Provider(models.TextChoices):
        MERCADO_PAGO = "MERCADO_PAGO", "Mercado Pago"
        STRIPE = "STRIPE", "Stripe"

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=8, default="BRL")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.CRIADA)
    provider = models.CharField(max_length=20, choices=Provider.choices)
    provider_ref = models.CharField(max_length=128, blank=True)
    created_at = models.DateTimeField(default=timezone.now)


class Receipt(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="receipt")
    number = models.CharField(max_length=64)
    issued_at = models.DateTimeField(default=timezone.now)
    pdf = models.CharField(max_length=255, blank=True)  # S3 key
    notes = models.TextField(blank=True)


class PaymentEvent(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="events")
    type = models.CharField(max_length=16, choices=[("WEBHOOK", "Webhook"), ("MANUAL", "Manual")])
    payload = models.JSONField(default=dict)
    received_at = models.DateTimeField(default=timezone.now)