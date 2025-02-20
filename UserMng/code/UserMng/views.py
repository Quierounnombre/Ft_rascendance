from django.shortcuts import render

from rest_framework.exceptions import ValidationError
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import UserSingUpSerializer
from .serializers import UserLoginSerializer

class	UserLoginAPIView(APIView):

	def login_empty_user_response():
		response = {
			"email": {
				"detail": "User Doesnot exist!"
			}
		}
		return (response)
	
	def login_succesfull_response(user):
		response = { 
			'success': True,
			'username': user.username,
			'email': user.email,
			'token':token.key
		}
		return (response)

	def post(self, request, *args, **kargs):
		serializer = UserLoginSerializer(data=request.data)
		if serializer.is_valid():
			response = login_empty_user_response()
			if User.objects.filter(username=request.data['email']).exists():
				user = User.objects.get(username=request.data['email'])
				token, created = Token.objects.get_or_create(user=user)
				response = login_succesfull_response(user)
				return Response(response, status=status.HTTP_200_OK)
			return Response(response, status=status.HTTP_400_BAD_REQUEST) 
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 


class	UserSingUpAPIView(APIView):

	def sing_up_succesfull_response(user, serializer):
		response = {
			'success': True,
			'user': serializer.data,
			'token': Token.objects.get(
			user=User.objects.get(username=serializer.data['email'])).key
		}
		return (response)

	def post(self, request, *args, **kargs):
		serializer = UserSingUpSerializer(data=request.data)
		if (serializer.is_valid()):
			serializer.save()
			response = sing_up_succesfull_response(user, serializer)
			return Response(response, status=status.HTTP_200_OK)
		raise ValidationError(serializer.errors, code=status.HTTP_406_NOT_ACCEPTABLE)

class UserLogoutAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def logout_response():
		response = {
			"success": True,
			"detail": "Logged out!"
		}
		return (response)

	def post(self, request, *args):
		token = Token.objects.get(user=request.user)
		token.delete()
		return Response(logout_response(), status=status.HTTP_200_OK)

