from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model, authenticate

from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from .models import Match

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework import filters

from .serializers import MatchSerializer

class AddMatch(APIView):
	def post(self, request):
		serializer = MatchSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserHistory(APIView):
	def get(self, request, pk):
		matches = Match.objects.filter(player1_id=pk) | Match.objects.filter(player2_id=pk)
		# print(matches);
		# if (len(matches) == 0):
		# 	return Response(status=status.HTTP_204_NO_CONTENT)
		serializer = MatchSerializer(matches, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)


