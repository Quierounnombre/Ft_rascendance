from django.urls import path
from .views import UserLoginAPIView
from .views import UserSingUpAPIView
from .views import UserLogoutAPIView
from .views import ProfileView
from .views import UserListView

from rest_framework import permissions
from rest_framework import authentication

urlpatterns = [
	path('login/', UserLoginAPIView.as_view(), name="user_login"),
	path('singup/', UserSingUpAPIView.as_view(), name="user_signup"),
	path('logout/', UserLogoutAPIView.as_view(), name="user_logout"),
	path('me/', ProfileView.as_view(
		{'get':'me',
		'put':'update'},
		permission_classes = [permissions.IsAuthenticated], 
		authentication_classes = [authentication.TokenAuthentication],
		), name="profile"),
    path('users/', UserListView.as_view(), name="user_list"),
]
