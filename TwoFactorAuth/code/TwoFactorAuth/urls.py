from .views import SendEmail
from .views import ValidateCode
from django.urls import path

urlpatterns = [
	path('', SendEmail.as_view(), name="SendEmail"),
	path('validate/', ValidateCode.as_view(), name="ValidateCode"),
]