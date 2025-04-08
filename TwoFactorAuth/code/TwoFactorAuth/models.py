from django.db import models

class	TwoFA_code():
	code = models.CharField()
	email = models.models.EmailField(unique=True)
	timestamp = models.DateTimeField(auto_now_add=True)
	#Chekear si existe un codigo ya existente en la DB, y de ser asi, comprobar si esta expirado, 
	#La idea es tener solo una clave por email
	#si hay una previa se sobreescribe
	#USER
	#TIME