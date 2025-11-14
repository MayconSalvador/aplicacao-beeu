from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0002_add_audience_if_missing"),
        ("courses", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="contentitem",
            name="course",
            field=models.ForeignKey(
                to="courses.course",
                on_delete=models.SET_NULL,
                null=True,
                blank=True,
                related_name="contents",
            ),
        ),
    ]