from django.shortcuts import redirect
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from rest_framework.exceptions import ValidationError
from rest_framework.authtoken.models import Token
from UserMng.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets

from .serializers import UserSingUpSerializer
from .serializers import UserLoginSerializer
from .serializers import UserProfileSerializer

from django.conf import settings

from authlib.integrations.django_client import OAuth

oauth = OAuth()

class	UserLoginAPIView(APIView):

	def login_empty_user_response(self):
		response = {
			"email": {
				"detail": "User Does not exist!"
			}
		}
		return (response)
	
	def login_succesfull_response(self, user, token):
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
			response = self.login_empty_user_response()
			if User.objects.filter(email=request.data['email']).exists():
				user = User.objects.get(email=request.data['email'])
				token, created = Token.objects.get_or_create(user=user)
				response = self.login_succesfull_response(user, token)
				return Response(response, status=status.HTTP_200_OK)
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
		return (Response(self.logout_response(), status=status.HTTP_200_OK))

class ProfileView(viewsets.ModelViewSet):
	queryset = get_user_model().objects.all()
	serializer_class = UserProfileSerializer

	def me(self, request, *args, **kwargs):
		User = get_user_model()
		self.object = get_object_or_404(User, pk=request.user.id)
		serializer = self.get_serializer(self.object)
		return (Response(serializer.data))

oauth.register(
	name = 'ft',
	client_id = settings.API_UID,
	client_secret = settings.API_SECRET,
	access_token_url = 'https://api.intra.42.fr/v2/oauth/token',
	access_token_params = None,
	authorize_url = 'https://api.intra.42.fr/v2/oauth/authorize',
	authorize_params= None,
	api_base_url = 'https://api.intra.42.fr/v2/',
	client_kwargs = {},
)

class OAuthLoginAPIView(APIView):
	def get(self, request):
		redirect_uri = request.build_absolute_uri('/auth/callback')
		return (oauth.ft.authorize_redirect(request, redirect_uri))

class OAuthCallbackAPIView(APIView):
	def	get(self, request, *args):
		token = oauth.ft.authorize_access_token(request)
		user_info  = oauth.ft.parse_id_token(request, token)
		return (redirect('/'))