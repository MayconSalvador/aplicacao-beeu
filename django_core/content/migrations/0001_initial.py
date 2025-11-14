from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='ContentItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('type', models.CharField(choices=[('VIDEO', 'Vídeo'), ('TEXTO', 'Texto'), ('LINK', 'Link')], max_length=10)),
                ('url', models.URLField()),
                ('is_active', models.BooleanField(default=True)),
                ('published_at', models.DateTimeField(blank=True, null=True)),
                ('audience', models.CharField(choices=[('ALL', 'Todos'), ('ALUNO', 'Aluno'), ('PROFESSOR', 'Professor')], default='ALL', max_length=16)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]