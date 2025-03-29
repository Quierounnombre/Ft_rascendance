from django.urls import path
from .views import UserLoginAPIView
from .views import UserSingUpAPIView
from .views import UserLogoutAPIView
from .views import OAuthLoginAPIView
from .views import OAuthCallbackAPIView
from .views import ProfileView
from .views import UserListView

from rest_framework import permissions
from rest_framework import authentication

urlpatterns = [
	path('login/', UserLoginAPIView.as_view(), name="user_login"),
	path('singup/', UserSingUpAPIView.as_view(), name="user_signup"),
	path('logout/', UserLogoutAPIView.as_view(), name="user_logout"),
	path('oauth_login/', OAuthLoginAPIView.as_view(), name='oauth_login'),
	path('auth_callback/', OAuthCallbackAPIView.as_view(), name='auth_callback'),
	path('me/', ProfileView.as_view(
		{'get':'me',
		'put':'update'},
		permission_classes = [permissions.IsAuthenticated], 
		authentication_classes = [authentication.TokenAuthentication],
		), name="profile"),
    path('users/', UserListView.as_view(
		permission_classes = [permissions.IsAuthenticated], 
		authentication_classes = [authentication.TokenAuthentication],
	), name="user_list"),
	path('friends/', ProfileView.as_view(
		{'get':'friends',
   		'put': 'add_friend',
        'delete': 'delete_friend'},
		permission_classes = [permissions.IsAuthenticated], 
		authentication_classes = [authentication.TokenAuthentication],
		), name="friends"),
]
