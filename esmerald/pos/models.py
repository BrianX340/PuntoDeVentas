from django.db import models

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name

class Article(models.Model):
    name = models.CharField(max_length=150)
    price = models.CharField(max_length=150)

    def __str__(self):
        return self.name
    