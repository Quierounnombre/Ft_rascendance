from .models import Match
from rest_framework import serializers
from rest_framework import status

class MatchSerializer(serializers.ModelSerializer):
	class Meta:
		model = Match
		fields = '__all__'
		not_required = ["tournament", "date"]