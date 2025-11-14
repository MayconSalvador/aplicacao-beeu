from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('slug', models.SlugField(unique=True)),
                ('description', models.TextField()),
                ('level', models.CharField(choices=[('A1', 'A1'), ('A2', 'A2'), ('B1', 'B1'), ('B2', 'B2'), ('C1', 'C1'), ('C2', 'C2')], max_length=2)),
                ('price_br', models.DecimalField(decimal_places=2, max_digits=10)),
                ('is_active', models.BooleanField(default=True)),
                ('syllabus', models.JSONField(blank=True, default=dict)),
                ('thumbnail', models.URLField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(default=1)),
                ('title', models.CharField(max_length=200)),
                ('summary', models.TextField(blank=True)),
                ('course', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='modules', to='courses.course')),
            ],
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(default=1)),
                ('title', models.CharField(max_length=200)),
                ('content', models.TextField(blank=True)),
                ('module', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='lessons', to='courses.module')),
            ],
        ),
        migrations.CreateModel(
            name='Material',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('LINK', 'Link'), ('FILE', 'Arquivo')], max_length=10)),
                ('url', models.URLField(blank=True, null=True)),
                ('file', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, max_length=255)),
                ('visible', models.BooleanField(default=True)),
                ('lesson', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='materials', to='courses.lesson')),
            ],
        ),
    ]