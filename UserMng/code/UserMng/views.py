from django.shortcuts import redirect
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.urls import reverse

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

# register(
#access_token_url = 'https://api.intra.42.fr/v2/oauth/token',
#authorize_url = 'https://api.intra.42.fr/v2/oauth/authorize',
#api_base_url = 'https://api.intra.42.fr/v2/',

class OAuthLoginAPIView(APIView):
	def load_query_string(self, params):
		q_str = ""

		for key, value in params.items():
			tmp_str = "&{0}={1}".format(key, value)
			q_str = q_str + tmp_str
		return (q_str)

	def get(self, request):
		redirect_uri = request.build_absolute_uri(reverse('auth_callback'))
		params = {
			'client_id' : settings.API_UID,
			'redirect_uri': redirect_uri,
			'scope': 'public',
			
			'response_type' : 'code',
		}
		auth_url = 'https://api.intra.42.fr/v2/oauth/authorize'
		query_string = self.load_query_string(params)
		final_auth_url = f"{auth_url}?{query_string}"

		return (redirect(final_auth_url))

class OAuthCallbackAPIView(APIView):
	def	get(self, request):
		bad_request = status.HTTP_400_BAD_REQUEST
		code = request.GET.get('code')
		if not code:
			return (Response({'error':'Auth code not recived'}, status=bad_request))
	
		redirect_uri = request.build_absolute_uri(reverse('auth_callback'))
		token_url = 'https://api.intra.42.fr/v2/oauth/token'
		data = {
			'client_id' : settings.API_UID,
			'client_secret' : settings.API_SECRET,
			'redirect_uri' : redirect_uri,
			'code' : code,
			'grant_type' : 'client_credentials',
		}

		token_response = request.get(token_url, params=data)
		token_json = token_response.json()
		access_token = token_json.get('access_token')

		if not access_token:
			return (Response({'error':'Access token not obtained.'}, status=bad_request))

		user_info_url = 'https://api.intra.42.fr/v2/'
		user_params = {
			'access_token' : access_token,
			'fields' : 'id,name,email'
		}

		user_info_response = request.get(user_info_url, params=user_params)
		user_info = user_info_response.json()

		return (Response({'user' : user_info}))