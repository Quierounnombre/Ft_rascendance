from rest_framework import serializers
from TwoFactorAuth.models import TwoFA_code

class SendEmailSerializer(serializers.ModelSerializer):
	email = serializers.CharField()
	
	class Meta:
		model = TwoFA_code
		fields = [
			"email"
		]
	
	def validate(self, instance):
		if (not instance['email']):
			raise ValidationError(detail="Missing email")
		return instance