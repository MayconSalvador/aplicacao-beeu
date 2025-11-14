from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from courses.models import Course
from enrollments.models import Enrollment
from payments.models import Order
from content.models import ContentItem


class Command(BaseCommand):
    help = "Cria dados de exemplo: 2 superusers, 1 professor, 2 alunos, 2 cursos, 1 compra PAGA/1 EM_ABERTO."

    def handle(self, *args, **options):
        User = get_user_model()

        # Superusers
        su1, _ = User.objects.get_or_create(username="admin1", defaults={
            "email": "admin1@example.com",
            "role": "SUPERUSER",
            "is_superuser": True,
            "is_staff": True,
        })
        su1.set_password("admin123")
        su1.save()

        su2, _ = User.objects.get_or_create(username="admin2", defaults={
            "email": "admin2@example.com",
            "role": "SUPERUSER",
            "is_superuser": True,
            "is_staff": True,
        })
        su2.set_password("admin123")
        su2.save()

        # Professor
        prof, _ = User.objects.get_or_create(username="professor", defaults={
            "email": "prof@example.com",
            "role": "PROFESSOR",
            "is_staff": True,
        })
        prof.set_password("prof123")
        prof.save()

        # Alunos
        aluno1, _ = User.objects.get_or_create(username="aluno1", defaults={
            "email": "aluno1@example.com",
            "role": "ALUNO",
        })
        aluno1.set_password("aluno123")
        aluno1.save()

        aluno2, _ = User.objects.get_or_create(username="aluno2", defaults={
            "email": "aluno2@example.com",
            "role": "ALUNO",
        })
        aluno2.set_password("aluno123")
        aluno2.save()

        # Cursos
        course1, _ = Course.objects.get_or_create(
            slug="ingles-a1",
            defaults={
                "title": "Inglês A1",
                "description": "Curso básico A1",
                "level": "A1",
                "price_br": 499.90,
                "is_active": True,
            },
        )
        course2, _ = Course.objects.get_or_create(
            slug="ingles-b1",
            defaults={
                "title": "Inglês B1",
                "description": "Curso intermediário B1",
                "level": "B1",
                "price_br": 699.90,
                "is_active": True,
            },
        )

        # Matrículas
        Enrollment.objects.get_or_create(student=aluno1, course=course1)
        Enrollment.objects.get_or_create(student=aluno2, course=course2)

        # Pedidos
        Order.objects.get_or_create(
            student=aluno1,
            course=course1,
            amount=course1.price_br,
            currency="BRL",
            status="PAGA",
            provider="MERCADO_PAGO",
            provider_ref="mp_ref_paid_001",
        )

        Order.objects.get_or_create(
            student=aluno2,
            course=course2,
            amount=course2.price_br,
            currency="BRL",
            status="CRIADA",
            provider="MERCADO_PAGO",
            provider_ref="mp_ref_open_001",
        )

        # Conteúdos
        ContentItem.objects.get_or_create(
            title="Aula de Pronúncia: Vogais em Inglês",
            defaults={
                "description": "Vídeo no YouTube sobre pronúncia de vogais.",
                "type": "VIDEO",
                "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "is_active": True,
                "audience": "ALUNO",
            },
        )
        ContentItem.objects.get_or_create(
            title="Artigo: Dicas de vocabulário para iniciantes",
            defaults={
                "description": "Texto com técnicas de memorização e exemplos.",
                "type": "TEXTO",
                "url": "https://example.com/artigos/vocabulario-iniciantes",
                "is_active": True,
                "audience": "ALL",
            },
        )
        ContentItem.objects.get_or_create(
            title="Playlist: Inglês A1",
            defaults={
                "description": "Playlist de vídeos para nível A1.",
                "type": "LINK",
                "url": "https://www.youtube.com/playlist?list=PL1234567890",
                "is_active": True,
                "audience": "PROFESSOR",
            },
        )

        self.stdout.write(self.style.SUCCESS("Seeds criados com sucesso."))