from django.db import models
from django.utils import timezone
from datetime import timedelta

class	TwoFA_code(models.Model):
	code = models.CharField()
	email = models.EmailField(unique=True)
	timestamp = models.DateTimeField(default=(timezone.now() + timedelta(minutes=5)))
	#Chekear si existe un codigo ya existente en la DB, y de ser asi, comprobar si esta expirado, 
	#La idea es tener solo una clave por email
	#si hay una previa se sobreescribe
	#USER
	#TIME
	class Meta:
		verbose_name = "2FA_code"
		verbose_name_plural = "2FA_codes"
		ordering = ['timestamp']
	
	def __str__(self):
		return (self.email)