from django.shortcuts import render

# Create your views here.
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework import generics
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView
from .forms import UserCreationForm
from django.shortcuts import get_object_or_404
from rest_framework.response import Response

from rest_framework import viewsets

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

class ProfileView(viewsets.ModelViewSet):
	queryset = get_user_model().objects.all()
	serializer_class = UserSerializer

	def me(self, request, *args, **kwargs):
		User = get_user_model()
		self.object = get_object_or_404(User, pk=request.user.id)
		serializer = self.get_serializer(self.object)
		return Response(serializer.data)