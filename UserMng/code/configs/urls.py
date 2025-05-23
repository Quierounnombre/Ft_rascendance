"""
URL configuration for configs project.

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
	1. Import the include() function: from django.urls import include, path
	2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
#IMPORTS FROM DJANGO CORE
from django.contrib import admin
from django.views.generic.base import TemplateView
from django.urls import path
from django.urls import include
from django.contrib.auth import views as auth_views
from django.conf.urls.static import static

#IMPORTS FROM OUR CODE
from . import settings

#IMPORTS FROM REST CORE
from rest_framework import permissions
from rest_framework import authentication
from rest_framework.authtoken import views as token_views

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
	path('admin/', admin.site.urls),
	path('profile/', include('UserMng.urls')),
	path('profile/api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)