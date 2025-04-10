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
import os

# Create your views here.

class	SendEmail(APIView):
	def post(self, request):
		bad_request = status.HTTP_400_BAD_REQUEST
		serializer = SendEmailSerializer(data=request.data)
		if (not serializer.is_valid()):
			Response("Validation Error", status=bad_request)
		target_email = request.GET.get('email')
		try:
			token = TwoFA_code.objects.get(email=target_email)
			token.delete()
		except:
			pass #ERASIN PREVIOUS ONE FROM DB
		new_code = TwoFA_code(code=(token_urlsafe(6)), email=(target_email))
		txt = "Welcome to the ramscendance, this is your 2FA, bear in mind, you only have 5 minutes to input the code: {code}".format(code=new_code.code)
		send_mail(
			"2FA",
			txt,
			settings.EMAIL_HOST_USER,
			[target_email],
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