from django.shortcuts import render

# Create your views here.
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework import generics
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView
from .forms import UserCreationForm

class UserList(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

class SignUpView(CreateView):
	form_class = UserCreationForm
	success_url = reverse_lazy("login")
	template_name = "registration/signup.html"