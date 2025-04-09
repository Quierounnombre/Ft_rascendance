from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from secrets import token_urlsafe
from TwoFactorAuth.models import TwoFA_code
from django.utils import timezone
import os

# Create your views here.

class	SendEmail(APIView):
	def get(self, request):
		random_emailer = "{0}{1}".format(os.urandom(6).hex(), "@gmail.com")
		new_code = TwoFA_code(code=(token_urlsafe(6)), email=(random_emailer))
		txt = "SENDING TO: {reciver} code: {code} create at: {timestamp}".format(reciver=new_code.email, code=new_code.code, timestamp=new_code.timestamp)
		send_mail(
			"2FA",
			txt,
			settings.EMAIL_HOST_USER,
			[""],
			fail_silently=False,
		)
		new_code.save()
		return(Response(txt)) #!ACTUAL RESPONSE
		
class	ValidateCode(APIView):
	def	post(self, request):
		bad_request = status.HTTP_400_BAD_REQUEST
		recv_code = request.data.get('code')
		recv_email = request.data.get('email')
		
		if not recv_code:
			return (Response({'error':'Missing 2FA code'}, status=bad_request))
		if not recv_email:
			return (Response({'error':'Missing User for 2FA'}, status=bad_request))
		
		try:
			token = TwoFA_code.objects.get(email=recv_email)
		except:
			return (Response({'error':'Empty 2FA record'}, status=bad_request))
		
		if token.timestamp < timezone.now():
			return (Response({'error':'Code has expired'}, status=bad_request))
		if token.code != recv_code:
			return (Response({'error':'Wrong code'}, status=bad_request))

		token.delete()
		return (Response("GUAY", status=status.HTTP_200_OK)) #!ACTUAL RESPONSE