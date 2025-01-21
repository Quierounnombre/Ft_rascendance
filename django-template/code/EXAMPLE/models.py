from django.db import models
from django.contrib.auth.models import AbstractUser
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
class CustomUser(AbstractUser):
    pass
    avatar = models.ImageField()
    idioma = models.CharField(max_length=3,
    choices = IDIOMAS,
    default=CASTELLANO,)
    fuente = models.IntegerField(default=14, validators=[MaxValueValidator(60), MinValueValidator(6)])

    def __str__(self):
    return self.username
    
