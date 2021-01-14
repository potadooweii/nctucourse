# Generated by Django 3.1.5 on 2021-01-04 20:07

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Bulletin',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(choices=[('news', '最新消息'), ('updated', '網站更新')], max_length=20)),
                ('text', models.TextField()),
                ('created_time', models.DateTimeField(auto_now_add=True)),
                ('last_updated_time', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]