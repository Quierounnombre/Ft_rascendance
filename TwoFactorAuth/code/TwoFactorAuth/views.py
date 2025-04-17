from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from secrets import token_urlsafe
from TwoFactorAuth.models import TwoFA_code
from django.utils import timezone
from .serializers import SendEmailSerializer
from .serializers import ValidateCodeSerializer 

from django.utils import timezone
from datetime import timedelta

import os

class	SendEmail(APIView):
	def erase_previous_token_from_db(self, email : str):
		try:
			token = TwoFA_code.objects.get(email=email)
			token.delete()
		except:
			pass #ERASIN PREVIOUS ONE FROM DB
	

	def timestamp_limit(self):
		return (timezone.now() + timedelta(minutes=5))
	
	def post(self, request):
		bad_request = status.HTTP_400_BAD_REQUEST
		serializer = SendEmailSerializer(data=request.data)
		if (not serializer.is_valid()):
			Response("Validation Error", status=bad_request)
	
		target_email = request.GET.get('email')

		self.erase_previous_token_from_db(target_email)
		try:
			new_code = TwoFA_code(code=(token_urlsafe(6)), email=(target_email), timestamp=(self.timestamp_limit()))
		except:
			return(Response("can't create 2FA code", status=bad_request))

		txt = "Welcome to the ramscendance, this is your 2FA, bear in mind, you only have 5 minutes to input the code: {code}".format(code=new_code.code)
		send_mail(
			"2FA",
			txt,
			settings.EMAIL_HOST_USER,
			[target_email],
			fail_silently=False,
		)
		new_code.save()
		return(Response(status=status.HTTP_200_OK))

class	ValidateCode(APIView):	
	def	post(self, request):
		bad_request = status.HTTP_400_BAD_REQUEST
		serializer = ValidateCodeSerializer(data = request.data)
		if (not serializer.is_valid()):
			Response("Validation Error", status=bad_request)

		recv_code = request.data.get('code')
		recv_email = request.data.get('email')
		
		if not recv_code:
			return (Response('Missing 2FA code', status=bad_request))
		if not recv_email:
			return (Response('Missing User for 2FA', status=bad_request))
		if (len(recv_code) > 20):
			return (Response('Invalid code', status=bad_request))
		
		try:
			token = TwoFA_code.objects.get(email=recv_email)
		except:
			return (Response('Empty 2FA record', status=bad_request))
		
		if token.timestamp < timezone.now():
			return (Response('Code has expired', status=bad_request))
		if token.code != recv_code:
			return (Response('Wrong code', status=bad_request))

		token.delete()
		return (Response(status=status.HTTP_200_OK))