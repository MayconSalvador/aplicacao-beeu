from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(
            sql=(
                "ALTER TABLE content_contentitem "
                "ADD COLUMN IF NOT EXISTS audience VARCHAR(16) NOT NULL DEFAULT 'ALL';"
            ),
            reverse_sql=(
                # Reverse left intentionally empty to avoid dropping column in production
                ""
            ),
        ),
    ]