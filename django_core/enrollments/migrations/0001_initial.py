from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
        ('courses', '0004_alter_material_lesson'),
    ]

    operations = [
        migrations.CreateModel(
            name='Enrollment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('ATIVA', 'Ativa'), ('CONCLUIDA', 'Concluída'), ('TRANCADA', 'Trancada'), ('CANCELADA', 'Cancelada')], default='ATIVA', max_length=20)),
                ('start_date', models.DateField(default=django.utils.timezone.now)),
                ('end_date', models.DateField(blank=True, null=True)),
                ('progress', models.PositiveIntegerField(default=0)),
                ('notes', models.TextField(blank=True)),
                ('student', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='enrollments', to='users.user')),
                ('course', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='enrollments', to='courses.course')),
            ],
        ),
        migrations.CreateModel(
            name='Attendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('present', models.BooleanField(default=False)),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('lesson', models.ForeignKey(on_delete=models.deletion.CASCADE, to='courses.lesson')),
                ('enrollment', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='attendances', to='enrollments.enrollment')),
            ],
        ),
        migrations.CreateModel(
            name='Grade',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.FloatField(default=0)),
                ('feedback', models.TextField(blank=True)),
                ('lesson', models.ForeignKey(on_delete=models.deletion.CASCADE, to='courses.lesson')),
                ('enrollment', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='grades', to='enrollments.enrollment')),
            ],
        ),
    ]