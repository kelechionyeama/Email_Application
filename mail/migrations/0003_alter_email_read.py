# Generated by Django 4.0.5 on 2022-07-02 22:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mail', '0002_alter_email_read'),
    ]

    operations = [
        migrations.AlterField(
            model_name='email',
            name='read',
            field=models.BooleanField(default=False),
        ),
    ]
