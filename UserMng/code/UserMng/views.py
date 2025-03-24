from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model, authenticate

from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from UserMng.models import User

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework import filters

from .serializers import UserSingUpSerializer
from .serializers import UserLoginSerializer
from .serializers import UserProfileSerializer
from .serializers import FriendsSerializer

class	UserLoginAPIView(APIView):

	def login_empty_user_response(self):
		response = {
			"email": {
				"detail": "User Does not exist!"
			}
		}
		return (response)

	def login_wrong_credentials_response(self):
		response = {
			"error": "Wrong email and/or password"
		}
		return (response)
	
	def login_succesfull_response(self, user, token):
		response = { 
			'success': True,
			'username': user.username,
			'email': user.email,
			'token':token.key,
			'font':user.font,
		}
		return (response)

	def post(self, request, *args, **kargs):
		serializer = UserLoginSerializer(data=request.data)
		if serializer.is_valid():
			response = self.login_empty_user_response()
			if User.objects.filter(email=request.data['email']).exists():
				if authenticate(email=request.data["email"], password=request.data["password"]):
					user = User.objects.get(email=request.data['email'])
					token, created = Token.objects.get_or_create(user=user)
					response = self.login_succesfull_response(user, token)
					return Response(response, status=status.HTTP_200_OK)
				return Response(self.login_wrong_credentials_response(), status=status.HTTP_400_BAD_REQUEST)
			return Response(response, status=status.HTTP_400_BAD_REQUEST) 
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 


class	UserSingUpAPIView(APIView):

	def sing_up_succesfull_response(self, serializer):
		response = {
			'success': True,
			'user': serializer.data,
			'token': Token.objects.get(
			user=User.objects.get(email=serializer.data['email'])).key
		}
		return (response)

	def post(self, request, *args, **kargs):
		serializer = UserSingUpSerializer(data=request.data)
		if (serializer.is_valid()):
			serializer.save()
			response = self.sing_up_succesfull_response(serializer)
			return Response(response, status=status.HTTP_200_OK)
		raise ValidationError(serializer.errors, code=status.HTTP_406_NOT_ACCEPTABLE)

class UserLogoutAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def logout_response(self):
		response = {
			"success": True,
			"detail": "Logged out!"
		}
		return (response)

	def post(self, request, *args):
		token = Token.objects.get(user=request.user)
		token.delete()
		return Response(self.logout_response(), status=status.HTTP_200_OK)

class ProfileView(viewsets.ModelViewSet):
	queryset = get_user_model().objects.all()
	serializer_class = UserProfileSerializer

	def me(self, request, *args, **kwargs):
		User = get_user_model()
		self.object = get_object_or_404(User, pk=request.user.id)
		serializer = self.get_serializer(self.object)
		return Response(serializer.data)

	def update(self, request, *args, **kwargs):
		User = get_user_model()
		self.object = get_object_or_404(User, pk=request.user.id)
		serializer = self.get_serializer(self.object, data=request.data,context={'request': request})
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def friends(self, request, *args, **kwargs):
		User = get_user_model()
		self.object = get_object_or_404(User, pk=request.user.id)
		serializer = FriendsSerializer(self.object)
		return Response(serializer.data)
	
	def add_friend(self, request, *args, **kwargs):
		self.object = get_object_or_404(get_user_model(), pk=request.user.id)
		self.object.following.add(request.data["friendID"])
		return Response(status=status.HTTP_204_NO_CONTENT)
	
	def delete_friend(self, request, *args, **kwargs):
		self.object = get_object_or_404(get_user_model(), pk=request.user.id)
		self.object.following.remove(request.data["friendID"])
		return Response(status=status.HTTP_204_NO_CONTENT)
	

class UserListView(ListAPIView):
    serializer_class = UserProfileSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email']

    def get_queryset(self):
        return get_user_model().objects.exclude(id=self.request.user.id)

