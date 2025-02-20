from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator
from django.core.validators import MinValueValidator

SPANISH = "ESP"
CATALAN = "CAT"
ENGLISH = "ENG"

LANGUAGES = [
	(SPANISH, "Spanish"),
	(CATALAN, "Catalan"),
	(ENGLISH, "English"),
]

class User(AbstractUser):
	avatar = models.ImageField(upload_to='media', default="default_user_img.png")
	language = models.CharField(
		max_length = 3,
		choices = LANGUAGES,
		default = SPANISH
	)
	font = models.IntegerField(
		default = 14,
		validators = [
			MaxValueValidator(60),
			MinValueValidator(6)
		]
	)
	email = models.EmailField(unique=True)

	USERNAME_FIELD = 'email'
	EMAIL_FIELD = 'email'
	REQUIRED_FIELDS = ['username']

	def __str__(self):
		return (self.username) 
