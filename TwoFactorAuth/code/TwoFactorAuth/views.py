from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import os

# Create your views here.

class	SendEmail(APIView):
	def get(self, request):
		send_mail(
			"2FA",
			"Providing a code " + os.urandom(6).hex(),
			settings.EMAIL_HOST_USER,
			[""],
			fail_silently=False,
		)
		return(Response(status=status.HTTP_200_OK))