from django.core.management.base import BaseCommand
from courses.models import Plan


class Command(BaseCommand):
    help = "Seed initial plans"

    def handle(self, *args, **options):
        plans = [
            {"name": "Light", "price": 150.00, "description": "1 x semanal"},
            {"name": "Fit", "price": 250.00, "description": "2 x semanal"},
            {"name": "Intense", "price": 350.00, "description": "3 x semanal"},
            {"name": "Prime", "price": 450.00, "description": "4 x semanal"},
        ]

        for p_data in plans:
            plan, created = Plan.objects.update_or_create(
                name=p_data["name"],
                defaults={"price": p_data["price"], "description": p_data["description"]}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Plano criado: {plan.name}"))
            else:
                self.stdout.write(f"Plano atualizado: {plan.name}")
