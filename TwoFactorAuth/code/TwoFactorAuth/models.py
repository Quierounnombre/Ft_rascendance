from django.db import models

# Create your models here.

class	TwoFA_code():
	code = models.CharField(
		
	)

	def	__str__(self):
		return self.name