# Generated by Django 4.0.2 on 2022-03-22 17:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Product2',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prodName', models.CharField(max_length=50)),
                ('prodDes', models.TextField(max_length=300)),
                ('prodDate', models.DateField()),
                ('prodPrice', models.IntegerField()),
                ('prodImage', models.ImageField(default='', upload_to='shop/images')),
            ],
        ),
    ]