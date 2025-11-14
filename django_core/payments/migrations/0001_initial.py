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
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('currency', models.CharField(default='BRL', max_length=8)),
                ('status', models.CharField(choices=[('CRIADA', 'Criada'), ('PAGA', 'Paga'), ('FALHOU', 'Falhou'), ('ESTORNADA', 'Estornada'), ('CANCELADA', 'Cancelada')], default='CRIADA', max_length=20)),
                ('provider', models.CharField(choices=[('MERCADO_PAGO', 'Mercado Pago'), ('STRIPE', 'Stripe')], max_length=20)),
                ('provider_ref', models.CharField(blank=True, max_length=128)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('course', models.ForeignKey(on_delete=models.deletion.CASCADE, to='courses.course')),
                ('student', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='orders', to='users.user')),
            ],
        ),
        migrations.CreateModel(
            name='Receipt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.CharField(max_length=64)),
                ('issued_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('pdf', models.CharField(blank=True, max_length=255)),
                ('notes', models.TextField(blank=True)),
                ('order', models.OneToOneField(on_delete=models.deletion.CASCADE, related_name='receipt', to='payments.order')),
            ],
        ),
        migrations.CreateModel(
            name='PaymentEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('WEBHOOK', 'Webhook'), ('MANUAL', 'Manual')], max_length=16)),
                ('payload', models.JSONField(default=dict)),
                ('received_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('order', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='events', to='payments.order')),
            ],
        ),
    ]