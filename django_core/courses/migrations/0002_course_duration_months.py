from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='duration_months',
            field=models.PositiveSmallIntegerField(choices=[(6, '6 meses'), (12, '12 meses')], default=6),
        ),
    ]