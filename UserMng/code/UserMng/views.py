from django.shortcuts import redirect
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.urls import reverse

from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
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
from .serializers import UserColorsSerializer
from .serializers import UserSaveSerializer

from django.conf import settings
from django.db import transaction

from secrets import token_urlsafe

import requests
import os

def create_tokens(user):
	refresh = RefreshToken.for_user(user)
	
	refresh.payload['email'] = user.email

	access = AccessToken.for_user(user)

	access.payload['email'] = user.email
	return {
		'refresh' : str (refresh),
		'access' : str(access),
	}

def load_query_string(params):
	q_str = ""

	for key, value in params.items():
		tmp_str = "&{0}={1}".format(key, value)
		q_str = q_str + tmp_str
	return (q_str)

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

	def post(self, request):
		serializer = UserLoginSerializer(data=request.data)
		send_email_url = 'http://TwoFactorAuth:8081/email/'
		if serializer.is_valid():
			response = self.login_empty_user_response()
			if User.objects.filter(email=request.data['email']).exists():
				if authenticate(email=request.data["email"], password=request.data["password"]):
					q_str = load_query_string({'email' : request.data['email']})
					email_loaded_url = f"{send_email_url}?{q_str}"
					requests.post(email_loaded_url)
					return Response(status=status.HTTP_200_OK) #REDIRECT?
				return Response(self.login_wrong_credentials_response(), status=status.HTTP_400_BAD_REQUEST)
			return Response(response, status=status.HTTP_400_BAD_REQUEST) 
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#! BE AWARE TO PASS THE EMAIL AND CODE IN THE BODY

class	GenerateToken(APIView):
	
	def	load_validate_response(self, request):
		response = {
			'email' : request.data['email'],
			'code' : request.data['code'],
		}
		return (response)
	
	def validate(self, request) -> bool:
		try:
			email = request.data['email']
		except:
			return False
		try:
			code = request.data['code']
		except:
			return False
		return True
	
	def post(self, request):
		bad_request = status.HTTP_400_BAD_REQUEST
		
		if not self.validate(request):
			return (Response(status=bad_request))
		
		json_for_validate = self.load_validate_response(request)
		validate_url = 'http://TwoFactorAuth:8081/email/validate/'
		response = requests.post(validate_url, json=json_for_validate)
		if (response.status_code != status.HTTP_200_OK):
			return (Response(response, status=bad_request))
		#SEND FIRST TO 2FA code to validate
		
		user = User.objects.get(email=request.data['email'])
		user.have_logged = True
		user.is_logged = True
		try:
			previous_token = RefreshToken(user)
			previous_token.blacklist()
		except:
			print("{0} No previous token".format(request.data['email']))
		user.save()
		token = create_tokens(user)
		return (Response(token, status=status.HTTP_200_OK))


class	UserSingUpAPIView(APIView):

	def sing_up_succesfull_response(self, serializer):
		response = {
			'success': True,
			'user': serializer.data,
		}
		return (response)

	def post(self, request):
		serializer = UserSingUpSerializer(data=request.data)
		send_email_url = 'http://TwoFactorAuth:8081/email/'
		if (serializer.is_valid()):
			q_str = load_query_string({'email' : request.data['email']})
			email_loaded_url = f"{send_email_url}?{q_str}"
			requests.post(email_loaded_url)
			serializer.save()
			response = self.sing_up_succesfull_response(serializer)
			return Response(response, status=status.HTTP_200_OK) #REDIRECT?
		raise ValidationError(serializer.errors, code=status.HTTP_406_NOT_ACCEPTABLE)

class UserLogoutAPIView(APIView):
	#permission_classes = [IsAuthenticated]

	def logout_response(self):
		response = {
			"success": True,
			"detail": "Logged out!"
		}
		return (response)

	def post(self, request):
		if (not request.data["refresh"]):
			return (Response("Missing token", status=status.HTTP_400_BAD_REQUEST))
		try:
			token = RefreshToken(request.data["refresh"])
			email = token.get('email')
			user = User.objects.get(email=email)
			user.is_looged = False
			user.save()
			token.blacklist()
		except:
			Response(status=status.HTTP_400_BAD_REQUEST)
		return (Response(self.logout_response(), status=status.HTTP_200_OK))

class ProfileView(viewsets.ModelViewSet):
	queryset = get_user_model().objects.all()
	serializer_class = UserProfileSerializer

	def me(self, request, *args, **kwargs):
		User = get_user_model()
		self.object = get_object_or_404(User, pk=request.user.id)
		serializer = self.get_serializer(self.object)
		return Response(serializer.data)

	def update(self, request):
		User = get_user_model()
		self.object = get_object_or_404(User, pk=request.user.id)
		serializer = UserSaveSerializer(self.object, data=request.data,context={'request': request})
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def colors(self, request):
		self.object = get_object_or_404(get_user_model(), pk=request.user.id)
		serializer = UserColorsSerializer(self.object)
		return Response(serializer.data);

	def friends(self, request, *args, **kwargs):
		User = get_user_model()
		self.object = get_object_or_404(User, pk=request.user.id)
		serializer = FriendsSerializer(self.object)
		return Response(serializer.data)
	
	def add_friend(self, request):
		self.object = get_object_or_404(get_user_model(), pk=request.user.id)
		self.object.following.add(request.data["friendID"])
		return Response(status=status.HTTP_204_NO_CONTENT)
	
	def delete_friend(self, request):
		self.object = get_object_or_404(get_user_model(), pk=request.user.id)
		self.object.following.remove(request.data["friendID"])
		return Response(status=status.HTTP_204_NO_CONTENT)
	

class UserListView(ListAPIView):
    serializer_class = UserProfileSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email']

    def get_queryset(self):
        return get_user_model().objects.all()

class OAuthLoginAPIView(APIView):

	def get(self, request):
		state_token = token_urlsafe(32)
		request.session['oauth_state'] = state_token
		redirect_uri = reverse('auth_callback')
		params = {
			'client_id' : settings.API_UID,
			'redirect_uri': "https://" + os.environ.get("OAUTH_HOST") + ":" + os.environ.get("NGINX_EXTERNAL_PORT"),# + "#oauth",
			'scope': 'public',
			'response_type' : 'code',
			'state': state_token,
		}
		auth_url = 'https://api.intra.42.fr/v2/oauth/authorize'
		query_string = load_query_string(params)
		final_auth_url = f"{auth_url}?{query_string}"

		return (redirect(final_auth_url))

class OAuthCallbackAPIView(APIView):
	def	get(self, request):
		bad_request = status.HTTP_400_BAD_REQUEST

		received_state = request.GET.get('state')
		stored_state = request.session.pop('oauth_state', None)
		if not stored_state:
			print("not stored state", flush=True)
			return (Response({'error': 'Invalid or missing state parameter.'}, status=bad_request))
		if stored_state != received_state:
			print("state not the same", flush=True)
			return (Response({'error': 'Invalid or missing state parameter.'}, status=bad_request))

		code = request.GET.get('code')
		if not code:
			print("no code", flush=True)
			return (Response({'error':'Auth code not recived'}, status=bad_request))
	
		redirect_uri = (reverse('auth_callback'))
		token_url = 'https://api.intra.42.fr/v2/oauth/token'
		data = {
			'client_id' : settings.API_UID,
			'client_secret' : settings.API_SECRET,
			'redirect_uri' : "https://" + os.environ.get("OAUTH_HOST") + ":"  + os.environ.get("NGINX_EXTERNAL_PORT"),# + "#oauth",
			'code' : code,
			'grant_type' : 'authorization_code',
		}

		token_response = requests.post(token_url, data=data)
		if token_response.status_code != status.HTTP_200_OK:
			print("post token url failed", flush=True)
			return (Response({'error': 'Failed to obtain access token.'}, status=bad_request))

		token_json = token_response.json()
		access_token = token_json.get('access_token')
		if not access_token:
			print("not access", flush=True)
			return (Response({'error':'Access token not obtained.'}, status=bad_request))

		user_info_url = 'https://api.intra.42.fr/v2/me'
		user_params = {
			'access_token' : access_token,
			'fields' : 'id,name,email'
		}

		user_info_response = requests.get(user_info_url, params=user_params)
		user_info = user_info_response.json()

		if not User.objects.filter(email=user_info.get('email'), have_logged=False).exists():
			email = user_info.get('email')
			username = user_info.get('login')
			first_name = user_info.get('first_name')
			last_name = user_info.get('last_name')
			with transaction.atomic():
				user = User.objects.get_or_create(
					email = email,
					defaults = {
						'username' : username,
						'first_name' : first_name,
						'last_name' : last_name,
					}
				)

		user = User.objects.get(email=user_info.get('email'))
		user.is_looged = True
		user.save()
		token = create_tokens(user)

		return (Response(token, status=status.HTTP_200_OK))
