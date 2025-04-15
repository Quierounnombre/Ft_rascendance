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
	avatar = models.ImageField(default="default_user_img.png")
	language = models.CharField(
		max_length = 3,
		choices = LANGUAGES,
		default = SPANISH
	)
	font = models.IntegerField(
		default = 18,
		validators = [
			MaxValueValidator(33),
			MinValueValidator(11)
		]
	)
	email = models.EmailField(unique=True)
	following = models.ManyToManyField("self", symmetrical=False)

	USERNAME_FIELD = 'email'
	EMAIL_FIELD = 'email'
	REQUIRED_FIELDS = ['username']

	me_color = models.CharField(default="#00ffff")
	other_color = models.CharField(default="#ffffff")
	ball_color = models.CharField(default="#ffffff")
	counter_color = models.CharField(default="#ffffff")

	def __str__(self):
		return (self.username) 
