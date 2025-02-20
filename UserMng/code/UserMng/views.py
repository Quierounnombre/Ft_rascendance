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

class UserLoginAPIView(APIView):
	def post(self, request, *args, **kargs):
		serializer = UserLoginSerializer(data=request.data)
		if serializer.is_valid():
			response = {
				"username": {
					"detail": "User Doesnot exist!"
				}
			}
			if User.objects.filter(username=request.data['username']).exists():
				user = User.objects.get(username=request.data['username'])
				token, created = Token.objects.get_or_create(user=user)
				response = {
					'success': True,
					'username': user.username,
					'email': user.email,
					'token':token.key
				}
				return Response(response, status=status.HTTP_200_OK)
			return Response(response, status=status.HTTP_400_BAD_REQUEST) 
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

# Create your views here.
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework import generics
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView
from .forms import UserCreationForm

class UserList(generics.ListAPIView):
	queryset = get_user_model().objects.all()
	serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
	queryset = get_user_model().objects.all()
	serializer_class = UserSerializer

class SignUpView(CreateView):
	form_class = UserCreationForm
	success_url = reverse_lazy("login")
	template_name = "registration/signup.html"