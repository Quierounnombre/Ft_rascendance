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
from django.contrib import admin
from django.urls import path
from django.urls import include
from django.conf.urls.static import static
from . import settings
from django.contrib.auth import views as auth_views
from rest_framework import permissions
from rest_framework import authentication
from django.views.generic.base import TemplateView
from rest_framework.authtoken import views as token_views
from history.views import AddMatch

urlpatterns = [
	path('admin/', admin.site.urls),
	path('history/', include('history.urls')),
	path('add/', AddMatch.as_view())
]
