from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


CASTELLANO = "ESP"
CATALA = "CAT"
INGLES = "ENG"
IDIOMAS = {
    CASTELLANO: "Castellano",
    CATALA: "Catala",
    INGLES: "English",
}

# Create your models here.
class User(models.Model):
    login = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    email = models.EmailField(unique=true)
    avatar = models.ImageField()

    idioma = models.CharField(max_length=3,
    choices = IDIOMAS,
    default=CASTELLANO,)
    fuente = models.IntegerField(default=14, validators=[MaxValueValidator(60), MinValueValidator(6)])
    
