from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_alter_material_lesson'),
    ]

    operations = [
        # No-op migration to align with existing DB dependency from enrollments initial
    ]