from .views import SendEmail
from django.urls import path

urlpatterns = [
	path('', SendEmail.as_view(), name="SendEmail"),
]